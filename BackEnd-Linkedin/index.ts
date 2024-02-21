import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import nodemailer from "nodemailer";
import cripto from "crypto";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import axios from "axios";
import {
  addPost,
  addUser,
  giveConnectionsRequest,
  acceptConnectionsRequest,
  receiveConnectionsRequest,
} from "./utils";

dotenv.config();
const prisma = new PrismaClient();
const app = express();
const port = 3001;
const http = require("http").Server(app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

http.listen(port, () => {
  console.log(`Server listening on ${port}`);
});

const socketIO = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

socketIO.on("connection", (socket: any) => {
  console.log(`⚡: ${socket.id} user just connected!`);
  socket.on("joinRoom", (room: String) => {
    socket.join(room);
    console.log(`⚡: ${socket.id} user just joined room ${room}!`);
  });
  socket.on("sendMessage", (message: any, room: String) => {
    console.log("sendMessage received");
    socket.to(room).emit("receiveMessage", message);
  });
});

app.get("/", async (req, res) => {
  res.send("Hello World");
});

app.get("/verificationSuccesfull", (req, res) => {
  res.sendFile(__dirname + "/verificationSuccesfull.html");
});

app.get("/verificationFailed", (req, res) => {
  res.sendFile(__dirname + "/verificationFailed.html");
});

app.get("/verificationInvalidToken", (req, res) => {
  res.sendFile(__dirname + "/verificationInvalidToken.html");
});

const sendVerificationEmail = async (
  email: string,
  verificationToken: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const appName = "Connect App";
  const url = process.env.BACKEND_URL;
  console.log(url);

  const mailOptions = {
    from: `${appName} <noreply@coolconnect.com>`,
    to: email,
    subject: "Verify Your Email Address",
    html: `
      <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="background-color: #007bff; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0;">Welcome to ${appName}!</h1>
        </div>
        <div style="background-color: #ffffff; padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h2 style="color: #007bff;">Email Verification</h2>
          <p>Hello there,</p>
          <p>We're thrilled to have you on board with us at ${appName}! To get started, please click on the link below to verify your email address:</p>
          <p style="text-align: center; margin-bottom: 20px;"><a href="${url}/verify/${verificationToken}" style="background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email Address</a></p>
          <p>If you didn't sign up for ${appName}, you can safely ignore this email.</p>
          <p>Best regards,<br/>The ${appName} Team</p>
        </div>
      </div>
    `,
  };

  // send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent");
  } catch (err) {
    console.log("Error sending email");
  }
};

app.post("/register", async (req, res) => {
  try {
    let { name, email, password } = req.body;
    email = email.trim();
    name = name.trim();
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (existingUser) {
      console.log("User already exists");
      return res.status(400).json({ message: "User already exists" });
    }
    const encrypt = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: encrypt,
        verified: false,
        verificationToken: cripto.randomBytes(16).toString("hex"),
      },
    });
    sendVerificationEmail(email, newUser.verificationToken || "");
    return res.status(200).json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "User register failed" });
  }
});

app.get("/verify/:verificationToken", async (req, res) => {
  try {
    const { verificationToken } = req.params;
    console.log(verificationToken);

    // find the user with this verification token
    console.log(verificationToken);
    const user = await prisma.user.findFirst({
      where: {
        verificationToken: verificationToken,
      },
    });

    if (!user) {
      return res.sendFile(__dirname + "/verificationInvalidToken.html");
    }

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        verified: true,
        verificationToken: "",
      },
    });

    return res.sendFile(__dirname + "/verificationSuccesfull.html");
  } catch (err) {
    console.log(err);
    return res.sendFile(__dirname + "/verificationFailed.html");
  }
});

const generateSecret = () => {
  return cripto.randomBytes(20).toString("hex");
};

async function sendPushNotification({
  expoPushToken,
  title,
  body,
}: {
  expoPushToken: string;
  title: string;
  body: string;
}) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

const secret = generateSecret();

// endpoint for login
app.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.trim();
    const user = await prisma.user.findUnique({
      where: {
        email: email.trim(),
      },
    });
    console.log(user);

    if (!user) {
      return res.status(200).json({ message: "user does not exist" });
    }
    // check if the password is correct
    const result = await bcrypt.compare(password, user.password);
    if (result === false) {
      return res.status(200).json({ message: "invalid credentials" });
    }
    // check if the user is verified
    if (!user.verified) {
      return res.status(200).json({ message: "user not verified" });
    }
    // login the user
    const token = jwt.sign({ userId: user.id }, secret);
    res.status(200).json({ token, message: "login successful" });
    console.log("login successful");
  } catch (e) {
    res.status(500).json({ message: "login failed" });
  }
});

app.get("/profile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving user profile" });
  }
});

app.get("/users/:userId", async (req, res) => {
  try {
    const loggedInUserId = req.params.userId;
    if (!loggedInUserId) {
      console.log("invalid user");
      return res.status(400).json({ message: "invalid user" });
    }
    const loggedInUser = await prisma.user.findUnique({
      where: {
        id: loggedInUserId,
      },
    });

    if (!loggedInUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const connectedUsers = [
      ...(loggedInUser?.connections || []),
      ...(loggedInUser?.connectionRequests || []),
      ...(loggedInUser?.sentConnectionRequests || []),
    ];
    let [_, oldusers]: any = await getUserByConnectionsBFS(
      loggedInUserId,
      50,
      ""
    );
    let users: any = [];
    for (let i = 1; i < oldusers.length; i++) {
      for (let j = 0; j < oldusers[i].length; j++) {
        users.push(oldusers[i][j]);
      }
    }
    users = users.filter(
      (user: any) =>
        !connectedUsers.includes(user.id) && user.id !== loggedInUserId
    );
    // fetch the users who are not in the logged-in user's connections
    if (users.length < 50) {
      const randomUsers = await prisma.user.findMany({
        where: {
          id: {
            notIn: connectedUsers,
          },
        },
        take: 50 - users.length,
      });
      users.push(...randomUsers);
    }

    // remove all the users who are already in the send-connection of user
    res.status(200).json({ users });
  } catch (error) {
    console.log("error retrieving users", error);
    res.status(500).json({ message: "error retriving users" });
  }
});

app.post("/connection-request", async (req, res) => {
  try {
    const { currentUserId, selectedUserId } = req.body;
    const current = await prisma.user.update({
      where: {
        id: currentUserId,
      },
      data: {
        sentConnectionRequests: {
          push: selectedUserId,
        },
      },
    });
    const selected = await prisma.user.update({
      where: {
        id: selectedUserId,
      },
      data: {
        connectionRequests: {
          push: currentUserId,
        },
      },
    });
    const notification = await prisma.notification.create({
      data: {
        authorId: currentUserId,
        receiverId: selectedUserId,
        title: "Connection Request",
        message: `You have a new connection request from ${current.name}`,
        type: "connectionRequest",
      },
    });
    sendPushNotification({
      body: `You have a new connection request from ${current.name}`,
      title: "Connection Request",
      expoPushToken: selected.expoPushToken || "",
    });
    await prisma.user.update({
      where: {
        id: selectedUserId,
      },
      data: {
        notifications: {
          push: notification.id,
        },
      },
    });
    res.status(200).json({ message: "connection request sent" });
  } catch (error) {
    console.log("error sending connection request", error);
    res.status(500).json({ message: "error sending connection request" });
  }
});

// endpoint to show all of the connections requests
app.get("/connection-requests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // populate the user's connection requests
    const connectionRequests = await prisma.user.findMany({
      where: {
        id: {
          in: user?.connectionRequests || [],
        },
      },
    });
    res.status(200).json({ connectionRequests });
  } catch (error) {
    console.log("error retrieving connection requests", error);
    res.status(500).json({ message: "error retrieving connection requests" });
  }
});

// endpoint to show all of the connections
app.get("/connections/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("connection", userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // populate the user's connections
    const connections = await prisma.user.findMany({
      where: {
        id: {
          in: user?.connections || [],
        },
      },
    });
    res.status(200).json({ connections });
  } catch (error) {
    res.status(500).json({ message: "error retrieving connections" });
  }
});

// endpoint to show all of the sendConnections
app.get("/sent-connection-requests/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("sent", userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    // populate the user's connections
    const sentConnectionRequests = await prisma.user.findMany({
      where: {
        id: {
          in: user?.sentConnectionRequests || [],
        },
      },
    });

    console.log("sent", sentConnectionRequests);
    res.status(200).json({ sentConnectionRequests });
  } catch (error) {
    res.status(500).json({ message: "error retrieving sent connections" });
  }
});

// endpoint to accept or reject a connection request
app.post("/connection-request/option", async (req, res) => {
  try {
    const { option, senderId, receiverId } = req.body;
    const sender = await prisma.user.findUnique({
      where: {
        id: senderId,
      },
    });
    const receiver = await prisma.user.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!sender || !receiver) {
      return res.status(400).json({ message: "invalid sender or receiver" });
    }
    await prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        connectionRequests: {
          set: receiver.connectionRequests?.filter((id) => id !== senderId),
        },
      },
    });
    // remove the connection request from the sender's sent connection requests
    await prisma.user.update({
      where: {
        id: senderId,
      },
      data: {
        sentConnectionRequests: {
          set: sender.sentConnectionRequests?.filter((id) => id !== receiverId),
        },
      },
    });
    // if the option is accept, add the sender to the receiver's connections and vice versa
    if (option === "accept") {
      await prisma.user.update({
        where: {
          id: receiverId,
        },
        data: {
          connections: {
            push: senderId,
          },
        },
      });
      await prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          connections: {
            push: receiverId,
          },
        },
      });
      const notification = await prisma.notification.create({
        data: {
          authorId: receiverId,
          receiverId: senderId,
          title: "Connection accepted",
          message: `We are adding ${receiver.name} to your connections`,
          type: "connectionAccepted",
        },
      });
      sendPushNotification({
        body: `We are adding ${receiver.name} to your connections`,
        title: "Connection accepted",
        expoPushToken: sender.expoPushToken || "",
      });
      await prisma.user.update({
        where: {
          id: senderId,
        },
        data: {
          notifications: {
            push: notification.id,
          },
        },
      });
      const message = await prisma.room.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId,
        },
      });
      await prisma.user.updateMany({
        where: {
          id: {
            in: [senderId, receiverId],
          },
        },
        data: {
          messageRooms: {
            push: message.id,
          },
        },
      });
    }
    res.status(200).json({ message: "connection request accepted or removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "error accepting or removing connection request" });
  }
});
// endpoint to create post

const sendNotification = ({
  authorId,
  receiverIds,
  title,
  message,
  postId,
}: {
  authorId: string;
  receiverIds: string[];
  title: string;
  message: string;
  postId: string;
}) => {
  receiverIds.forEach(async (receiverId) => {
    const notification = await prisma.notification.create({
      data: {
        authorId: authorId,
        receiverId: receiverId,
        title: title,
        message: message,
        type: "post",
        postId: postId,
      },
    });
    const receiver = await prisma.user.update({
      where: {
        id: receiverId,
      },
      data: {
        notifications: {
          push: notification.id,
        },
      },
    });

    sendPushNotification({
      body: message,
      title: title,
      expoPushToken: receiver.expoPushToken || "",
    });
  });
};

app.post("/createPost", async (req, res) => {
  try {
    const { userId, description, image, mimiType } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const post = await prisma.post.create({
      data: {
        description: description,
        imageUrl: image,
        authorId: userId,
        mimiType: mimiType,
      },
    });

    user.posts?.push(post.id);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        posts: {
          set: user.posts,
        },
      },
    });

    const connections = user.connections;
    sendNotification({
      authorId: userId,
      receiverIds: connections || [],
      title: "New Post",
      message: `${user.name} has created a new post`,
      postId: post.id,
    });

    console.log("post created successfully");
    res.status(200).json({ message: "post created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error creating post" });
  }
});

const getPostByConnectionsBFS = async (
  initialConnections: string,
  maxCount: number,
  user: string
): Promise<[UserWithLevel[][], any[]]> => {
  const usersByLevel: UserWithLevel[][] = [];
  let postMatching: any[] = [];
  let queue: { connections: string[]; level: number } = {
    connections: [initialConnections],
    level: 1,
  };
  const visited = new Set<string>(); // Set to keep track of visited users

  while (queue.connections.length > 0) {
    let { connections, level } = queue;
    connections = connections.filter((connection) => !visited.has(connection));
    connections.forEach((connection) => visited.add(connection));
    if (postMatching.length >= maxCount) {
      break;
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: connections,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        headline: true,
        connections: true,
        posts: true,
      },
    });

    usersByLevel[level - 1] = usersByLevel[level - 1] || [];
    users.forEach(async (user) => {
      usersByLevel[level - 1].push({ id: user.id, level: level - 1 });
      if (user.posts.length > 0) {
        const recentPostsCount =
          Math.floor(Math.random() * user.posts.length) + 1;
        const recentPostIds = user.posts.slice(-recentPostsCount);
        const recentPosts: any[] = await prisma.post.findMany({
          where: {
            id: {
              in: recentPostIds,
            },
          },
        });
        recentPosts.forEach((recentPost) => {
          recentPost.user = user;
          postMatching.push(recentPost);
        });
      }
    });

    if (postMatching.length < maxCount) {
      let newConnections: string[] = [];
      users.forEach((user) => {
        newConnections.push(...user.connections);
      });
      newConnections = newConnections.filter(
        (connection) => !visited.has(connection)
      );
      queue = { connections: newConnections, level: level + 1 };
    }
  }
  postMatching = postMatching.filter((post) => {
    return post.authorId !== user;
  });
  if (postMatching.length < maxCount) {
    // get random feeds which is not in the above post aswell as not the user post
    const randomPosts = await prisma.post.findMany({
      where: {
        AND: {
          authorId: {
            not: user,
          },
          id: {
            notIn: postMatching.map((post) => post.id),
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: maxCount - postMatching.length,
    });
    for (let i = 0; i < randomPosts.length; i++) {
      const post: any = randomPosts[i];
      const author = await prisma.user.findUnique({
        where: {
          id: post.authorId,
        },
      });
      post.user = author;
    }
    postMatching = [...postMatching, ...randomPosts];
  }

  return [usersByLevel, postMatching];
};

// endpoint to get all posts
app.get("/post/:userId/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = req.query.page || 1;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const [usersByLevel, posts] = await getPostByConnectionsBFS(
      userId,
      50,
      userId
    );
    console.log(posts.length);
    if (posts.length < 50) {
      const randomPosts = await prisma.post.findMany({
        where: {
          authorId: {
            not: userId,
          },
          id: {
            notIn: posts.map((post) => post.id),
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 50 - posts.length,
      });
      for (let i = 0; i < randomPosts.length; i++) {
        const post: any = randomPosts[i];
        const author = await prisma.user.findUnique({
          where: {
            id: post.authorId,
          },
        });
        post.user = author;
      }
      // sort the collection based on the created at
      posts.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      for (let i = randomPosts.length - 1; i > 0; i -= 5) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomPosts[i], randomPosts[j]] = [randomPosts[j], randomPosts[i]];
      }
      posts.push(...randomPosts);
    }
    const nposts = posts.filter((post) => post.authorId !== userId);
    return res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "error getting posts" });
  }
});

// endpoint to get all user posts
app.get("/userPost/:userId/", async (req, res) => {
  try {
    const userId = req.params.userId;
    const page = req.query.page || 1;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: user.posts || [],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      // take: 10,
    });
    for (let i = 0; i < posts.length; i++) {
      const post: any = posts[i];
      post.user = user;
    }
    return res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: "error getting posts" });
  }
});

// endpoint to like the post
app.post("/likePost", async (req, res) => {
  try {
    const { userId, postId, like } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(400).json({ message: "invalid post" });
    }
    if (like) {
      if (post.likes?.includes(userId)) {
        return res.status(400).json({ message: "post already liked" });
      }
      post.likes?.push(userId);
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            set: post.likes,
          },
        },
      });
      if (post.authorId !== userId) {
        const notification = await prisma.notification.create({
          data: {
            authorId: userId,
            receiverId: post.authorId,
            title: "New Like",
            message: `${user.name} has liked your post`,
            type: "like",
            postId: postId,
          },
        });
        const postAuthor = await prisma.user.update({
          where: {
            id: post.authorId,
          },
          data: {
            notifications: {
              push: notification.id,
            },
            likes: {
              push: userId,
            },
          },
        });

        sendPushNotification({
          body: `${user.name} has liked your post`,
          title: "New Like",
          expoPushToken: postAuthor.expoPushToken || "",
        });
      }
    } else {
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          likes: {
            set: post.likes?.filter((id) => id !== userId),
          },
        },
      });
      if (post.authorId !== userId) {
        const getNotification = await prisma.notification.findFirst({
          where: {
            authorId: userId,
            receiverId: post.authorId,
            title: "New Like",
            message: `${user.name} has liked your post`,
          },
        });
        await prisma.notification.delete({
          where: {
            id: getNotification?.id,
          },
        });
      }
      await prisma.user.update({
        where: {
          id: post.authorId,
        },
        data: {
          notifications: {
            set: post.likes?.filter((id) => id !== userId),
          },
          likes: {
            set: post.likes?.filter((id) => id !== userId),
          },
        },
      });
    }
    res.status(200).json({ message: "post liked successfully" });
  } catch (error) {
    res.status(500).json({ message: "error liking post" });
  }
});

// endpoint to get jobs
app.post("/jobs", async (req, res) => {
  try {
    const { keyword, page } = req.body;

    const jobs = await prisma.job.findMany({
      where: {
        OR: [
          {
            job_title: {
              contains: (keyword as string) || "",
            },
          },
          {
            job_country: {
              contains: (keyword as string) || "",
            },
          },
          {
            job_city: {
              contains: (keyword as string) || "",
            },
          },
          {
            job_description: {
              contains: (keyword as string) || "",
            },
          },
          {
            job_required_skills: {
              has: (keyword as string) || "",
            },
          },
          {
            job_state: {
              contains: (keyword as string) || "",
            },
          },
          {
            job_employment_type: {
              contains: (keyword as string) || "",
            },
          },
        ],
      },
      orderBy: [
        { job_title: "asc" },
        { job_required_skills: "asc" },
        { job_description: "asc" },
        { job_employment_type: "asc" },
        { job_country: "asc" },
        { job_city: "asc" },
        { job_state: "asc" },
      ],

      skip: (((page || 1) as number) - 1) * 10,
      take: 20,
      select: {
        id: true,
        employer_company_type: true,
        employer_logo: true,
        employer_name: true,
        job_country: true,
        job_city: true,
        job_state: true,
        job_title: true,
        job_job_title: true,
        job_is_remote: true,
        job_employment_type: true,
      },
    });
    res.status(200).json({ jobs });
  } catch (error) {
    console.log("error getting jobs");
    res.status(500).json({ message: "error getting jobs" });
  }
});

// endpoint to get job by id
app.get("/job/:jobId", async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const job = await prisma.job.findUnique({
      where: {
        id: jobId,
      },
    });
    if (!job) {
      return res.status(400).json({ message: "invalid job" });
    }
    res.status(200).json({ job });
  } catch (error) {
    res.status(500).json({ message: "error getting job" });
  }
});

// endpoint get peoplelist
app.get("/peoplelist/:userId", async (req, res) => {
  try {
    console.log("peoplelist");
    const userId = req.params.userId;
    const rooms = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        messageRooms: true,
      },
    });
    console.log(rooms);
    if (!rooms) {
      return res.status(400).json({ message: "invalid user" });
    } else {
      const Rooms = await prisma.room.findMany({
        where: {
          id: {
            in: rooms.messageRooms || [],
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
      res.status(200).json({ Rooms });
    }
  } catch (err) {
    res.status(500).json({ message: "error getting peoplelist" });
  }
});

// endpoint to get room
app.get("/getRoom/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    return res.status(200).json({ room });
  } catch (err) {
    return res.status(500).json({ message: "error getting room" });
  }
});

//  endpoint to create room
app.post("/createMessage", async (req, res) => {
  try {
    const text = req.body.text;
    const roomId = req.body.roomId;
    const userId = req.body.userId;
    const imageUrl = req.body.imageUrl;

    const message = await prisma.message.create({
      data: {
        imageUrl: imageUrl,
        text: text,
        roomId: roomId,
        userId: userId,
      },
    });

    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        messages: {
          connect: {
            id: message.id,
          },
        },
        newMessage: text,
        updatedAt: new Date().toISOString(),
        time: new Date().toISOString(),
      },
    });

    console.log(message);
    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error creating message" });
  }
});

// endpoint to get message
app.get("/getMessage/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    console.log(roomId);
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) {
      return res.status(400).json({ message: "invalid room" });
    }

    const messages = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
      select: {
        messages: true,
      },
    });

    console.log(messages);
    return res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "error getting room" });
  }
});

// endpoint to edit  profile
app.post("/editProfile/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const {
      firstName,
      lastName,
      additionalName,
      pronouns,
      headline,
      industry,
      education,
      educations,
      city,
      country,
      contactInfo,
    } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user);
    console.log(
      firstName,
      lastName,
      additionalName,
      pronouns,
      headline,
      industry,
      education,
      city,
      country,
      contactInfo
    );
    let contactId = null;
    let educationIds = [];
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const previousEducation: string[] = user.education;
    const previosContactInfoId = user.contact;
    console.log(1);
    if (previosContactInfoId) {
      console.log(2);
      const previosContactInfo = await prisma.contact.findUnique({
        where: {
          id: previosContactInfoId,
        },
      });
      if (previosContactInfo) {
        const previousWebsite = await prisma.website.deleteMany({
          where: {
            id: {
              in: previosContactInfo.websiteId,
            },
          },
        });
        console.log(3);
        console.log("new website");
        const newWebsite = [];
        for (let i = 0; i < contactInfo.websites.length; i++) {
          const website = await prisma.website.create({
            data: {
              websiteUrl: contactInfo.websites[i].websiteUrl,
              websiteType: contactInfo.websites[i].websiteType,
            },
          });
          newWebsite.push(website.id);
        }
        console.log(4);
        await prisma.contact.update({
          where: {
            id: previosContactInfoId,
          },
          data: {
            email: contactInfo.email,
            phone: contactInfo.phone,
            discription: contactInfo.address,
            websiteId: newWebsite,
          },
        });
      }
      console.log(5);
      contactId = previosContactInfoId;
    } else {
      console.log(6);
      console.log("new website", contactInfo.websites);
      const newWebsite = [];
      for (let i = 0; i < contactInfo.websites.length; i++) {
        const website = await prisma.website.create({
          data: {
            websiteUrl: contactInfo.websites[i].websiteUrl,
            websiteType: contactInfo.websites[i].websiteType,
          },
        });
        newWebsite.push(website.id);
      }
      console.log(7);
      const contact = await prisma.contact.create({
        data: {
          email: contactInfo.email,
          phone: contactInfo.phone,
          discription: contactInfo.address,
          websiteId: newWebsite,
        },
      });
      contactId = contact.id;
    }
    console.log("contactId", contactId);
    if (previousEducation) {
      await prisma.education.deleteMany({
        where: {
          id: {
            in: previousEducation,
          },
        },
      });
    }
    console.log(educations);
    console.log(8);
    for (let i = 0; i < educations.length; i++) {
      const edu = await prisma.education.create({
        data: {
          schoolName: educations[i].school,
          degree: educations[i].degree,
          fieldOfStudy: educations[i].fieldOfStudy,
          startDate: educations[i].startDate || new Date().toISOString(),
          endDate: educations[i].endDate || new Date().toISOString(),
          skills: educations[i].skills,
          isCurrent: education.school == educations[i].school,
        },
      });
      console.log(new Date(educations[i].startDate), educations[i].endDate);
      console.log(education.school == educations[i].school);
      educationIds.push(edu.id);
    }
    console.log(9);
    console.log("education", educationIds);
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName: firstName,
        lastName: lastName,
        additionalName: additionalName,
        pronouns: pronouns,
        headline: headline,
        industry: industry,
        education: educationIds,
        city: city,
        country: country,
        contact: contactId,
      },
    });
    console.log("profile edited successfully");
    res.status(200).json({ message: "profile edited successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error editing profile" });
  }
});

// endpoint to get user full detail
app.get("/userFullDetail/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    console.log("userFullDetail", userId);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const contactId = user?.contact;
    const educationIds = user?.education;
    let contact = null;
    const educations = [];
    if (contactId) {
      contact = await prisma.contact.findUnique({
        where: {
          id: contactId,
        },
      });
      const websiteid = contact?.websiteId;
      const websites = [];
      if (websiteid) {
        const website = await prisma.website.findMany({
          where: {
            id: {
              in: websiteid,
            },
          },
        });
        websites.push(website);
      }
      contact = { ...contact, websites: websites };
    }
    if (educationIds) {
      const education = await prisma.education.findMany({
        where: {
          id: {
            in: educationIds,
          },
        },
      });
      educations.push(education);
    }
    const result = {
      ...user,
      contact,
      educations,
    };
    console.log(result);
    res.status(200).json({ result });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error getting data" });
  }
});

// endpoint to update user profile image
app.post("/setProfileImage/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { profileImage } = req.body;
    console.log(profileImage);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const user1 = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImage: profileImage,
      },
    });
    console.log(user1);
    console.log("profile image updated successfully");
    res.status(200).json({ message: "profile image updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error updating profile image" });
  }
});

// endpoint to update user banner image
app.post("/setBannerImage/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { bannerImage } = req.body;
    // console.log(profileImage);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const user1 = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        banner: bannerImage,
      },
    });
    console.log(user1);
    console.log("banner image updated successfully");
    res.status(200).json({ message: "banner image updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error updating banner image" });
  }
});

// endpoint to update user about
app.post("/setAbout/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const { about } = req.body;
    // console.log(profileImage);
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const user1 = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        userDescription: about,
      },
    });
    console.log("about updated successfully");
    res.status(200).json({ message: "about updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error updating about" });
  }
});

const fetchCommentsAndAuthor = async (commentsId: any) => {
  try {
    const comments: any = await prisma.comment.findMany({
      where: {
        id: {
          in: commentsId || [],
        },
      },
    });
    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      const author = await prisma.user.findUnique({
        where: {
          id: comment.authorId,
        },
        select: {
          id: true,
          name: true,
          profileImage: true,
          headline: true,
        },
      });
      comment.author = author;
      const recentCommentofComment =
        comment.comments.length > 0
          ? comment.comments[comment.comments.length - 1]
          : null;
      if (recentCommentofComment) {
        const recentComment: any = await prisma.comment.findUnique({
          where: {
            id: recentCommentofComment,
          },
        });
        if (!recentComment) {
          continue;
        }
        const recentCommentAuthor = await prisma.user.findUnique({
          where: {
            id: recentComment.authorId,
          },
          select: {
            id: true,
            name: true,
            profileImage: true,
            headline: true,
          },
        });
        recentComment.author = recentCommentAuthor;
        comment.comments[0] = recentComment;
      }
    }
    return comments;
  } catch (err) {
    console.log(err);
  }
};

// endpoint to get post by id
app.get("/postById/:postId", async (req, res) => {
  try {
    console.log("postById" + " " + req.params.postId);
    const postId = req.params.postId;
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!post) {
      return res.status(400).json({ message: "invalid post" });
    }
    const authorId = post.authorId;
    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    const liked = post.likes;
    const comments = post.comments;
    const likedUsers = await prisma.user.findMany({
      where: {
        id: {
          in: liked || [],
        },
      },
      select: {
        name: true,
        profileImage: true,
        headline: true,
      },
    });
    const newPost = {
      ...post,
      user: author,
      likedUsers: likedUsers,
      comments: await fetchCommentsAndAuthor(comments),
    };
    // console.log(newPost);
    res.status(200).json({ post: newPost });
  } catch (error) {
    res.status(500).json({ message: "error getting post" });
  }
});

// endpoint to comment on Post
app.post("/addCommentOnPost", async (req, res) => {
  try {
    const { userId, postId, text } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    if (!user || !post)
      res.status(500).json({ message: "user or post not found" });
    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        text: text,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        comments: {
          push: comment.id,
        },
      },
    });
    await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        comments: {
          push: comment.id,
        },
      },
    });
    if (!post) {
      return res.status(400).json({ message: "invalid post" });
    }
    if (userId != post.authorId) {
      const notification = await prisma.notification.create({
        data: {
          title: `${user?.name} has commented on your post`,
          message: `${text}`,
          receiverId: post.authorId,
          authorId: userId,
          type: "comment",
          postId: postId,
        },
      });

      const postAuthor = await prisma.user.update({
        where: {
          id: post.authorId,
        },
        data: {
          notifications: {
            push: notification.id,
          },
        },
      });

      sendPushNotification({
        body: `${user?.name} has commented on your post`,
        title: "New Comment",
        expoPushToken: postAuthor.expoPushToken || "",
      });
    }
    res.status(200).json({ message: "comment created succesfully" });
  } catch (err) {
    res.status(500).json({ message: "error creating comment" });
  }
});

// --------------------------------------
app.get("/commentById/:commentId", async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      return res.status(400).json({ message: "invalid comment" });
    }
    const authorId = comment.authorId;
    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    const liked = comment.likes;
    const comments = comment.comments;
    const likedUsers = await prisma.user.findMany({
      where: {
        id: {
          in: liked || [],
        },
      },
      select: {
        name: true,
        profileImage: true,
        headline: true,
      },
    });
    const newComment = {
      ...comment,
      author: author,
      likedUsers: likedUsers,
      comments: await fetchCommentsAndAuthor(comments),
    };

    res.status(200).json({ comment: newComment });
  } catch (error) {
    res.status(500).json({ message: "error getting comment" });
  }
});

app.post("/addCommentOnComment", async (req, res) => {
  try {
    const { userId, CommentId, text } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const Comment = await prisma.comment.findUnique({
      where: {
        id: CommentId,
      },
    });
    if (!user || !Comment)
      res.status(500).json({ message: "user or post not found" });
    const comment = await prisma.comment.create({
      data: {
        authorId: userId,
        text: text,
      },
    });
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        comments: {
          push: comment.id,
        },
      },
    });
    await prisma.comment.update({
      where: {
        id: CommentId,
      },
      data: {
        comments: {
          push: comment.id,
        },
      },
    });
    if (!Comment) {
      return res.status(400).json({ message: "invalid comment" });
    }
    if (userId != Comment.authorId) {
      const notification = await prisma.notification.create({
        data: {
          title: `${user?.name} has commented on your comment`,
          message: `${text}`,
          receiverId: Comment.authorId,
          authorId: userId,
          type: "comment",
          commentId: CommentId,
        },
      });

      const postAuthor = await prisma.user.update({
        where: {
          id: Comment.authorId,
        },
        data: {
          notifications: {
            push: notification.id,
          },
        },
      });

      sendPushNotification({
        body: `${user?.name} has commented on your comment`,
        title: "New Comment",
        expoPushToken: postAuthor.expoPushToken || "",
      });
    }
    res.status(200).json({ message: "comment created succesfully" });
  } catch (err) {
    res.status(500).json({ message: "error creating comment" });
  }
});

app.post("/likeComment", async (req, res) => {
  try {
    const { commentId, userId } = req.body;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const post = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    });
    if (!post) {
      return res.status(400).json({ message: "invalid post" });
    }
    let notification: any = null;
    if (post.likes?.includes(userId)) {
      console.log("unliking comment");
      if (post.authorId !== userId) {
        notification = await prisma.notification.findFirst({
          where: {
            title: "New Like",
            message: `${user.name} has liked your comment`,
            receiverId: post.authorId,
            authorId: userId,
          },
        });
        if (notification)
          await prisma.notification.delete({
            where: {
              id: notification?.id,
            },
          });
      }
      await prisma.user.update({
        where: {
          id: post.authorId,
        },
        data: {
          notifications: {
            set: post.likes?.filter((id) => id !== notification?.id),
          },
          likes: {
            set: post.likes?.filter((id) => id !== userId),
          },
        },
      });
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            set: post.likes?.filter((id) => id !== userId),
          },
        },
      });
      return res.status(200).json({ message: "comment  unliked succesfully" });
    } else {
      await prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          likes: {
            push: userId,
          },
        },
      });
      if (post.authorId !== userId) {
        notification = await prisma.notification.create({
          data: {
            title: "New Like",
            message: `${user.name} has liked your comment`,
            receiverId: post.authorId,
            authorId: userId,
            type: "like",
            commentId: commentId,
          },
        });
        const commentAuthor = await prisma.user.update({
          where: {
            id: post.authorId,
          },
          data: {
            notifications: {
              push: notification.id,
            },
          },
        });
        sendPushNotification({
          body: `${user.name} has liked your comment`,
          title: "New Like",
          expoPushToken: commentAuthor.expoPushToken || "",
        });
      }
      await prisma.user.update({
        where: {
          id: post.authorId,
        },
        data: {
          likes: {
            push: userId,
          },
        },
      });
    }

    res.status(200).json({ message: "comment liked successfully" });
  } catch (err) {
    res.status(500).json({ message: "error liking comment" });
  }
});

app.get("/notifications/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const notificationsId = user.notifications;
    const notifications: any = await prisma.notification.findMany({
      where: {
        id: {
          in: notificationsId || [],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    for (let i = 0; i < notifications.length; i++) {
      const authorId = notifications[i].authorId;
      const author = await prisma.user.findUnique({
        where: {
          id: authorId,
        },
        select: {
          id: true,
          name: true,
          profileImage: true,
          headline: true,
        },
      });
      notifications[i].author = author;
    }
    console.log(notifications);
    res.status(200).json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "error getting notifications" });
  }
});

app.post("/changeExpoToken", async (req, res) => {
  try {
    // console.log(req.body);
    const { userId, expoToken } = req.body;
    if (!userId || !expoToken) {
      console.log("invalid user or expo token");
      return res.status(400).json({ message: "invalid user or expo token" });
    }
    console.log(userId, expoToken);
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        expoPushToken: expoToken,
      },
    });
    console.log(user);
    console.log("expo token updated successfully");
    res.status(200).json({ message: "expo token updated successfully" });
  } catch (err) {
    console.log(err);
  }
});
interface UserWithLevel {
  id: string;
  level: number;
}

const getUserByConnectionsBFS = async (
  initialConnections: string,
  maxCount: number,
  keyword: string
): Promise<[UserWithLevel[][], any[]]> => {
  const usersByLevel: UserWithLevel[][] = [];
  let userMatching: any[] = [];
  const queue: { connections: string[]; level: number }[] = [
    { connections: [initialConnections], level: 1 },
  ];
  const visited = new Set<string>(); // Set to keep track of visited users

  while (queue.length > 0 && queue[0].connections.length > 0) {
    let { connections, level } = queue.shift()!;
    connections = connections.filter((connection) => !visited.has(connection));
    connections.forEach((connection) => visited.add(connection));
    if (userMatching.length >= maxCount) {
      break;
    }

    const nusers = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: keyword, mode: "insensitive" } },
              { headline: { contains: keyword, mode: "insensitive" } },
              { industry: { contains: keyword, mode: "insensitive" } },
              { email: { contains: keyword, mode: "insensitive" } },
              { city: { contains: keyword, mode: "insensitive" } },
              { country: { contains: keyword, mode: "insensitive" } },
              { additionalName: { contains: keyword, mode: "insensitive" } },
              { userDescription: { contains: keyword, mode: "insensitive" } },
            ],
          },
          { id: { in: connections } },
        ],
      },
      select: {
        id: true,
        name: true,
        profileImage: true,
        headline: true,
        industry: true,
        email: true,
      },
    });

    userMatching = [
      ...userMatching,
      nusers.map((user) => {
        return {
          ...user,
          level: level - 1,
        };
      }),
    ];
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: connections,
        },
      },
    });

    usersByLevel[level - 1] = usersByLevel[level - 1] || [];
    users.forEach((user) => {
      usersByLevel[level - 1].push({ id: user.id, level: level - 1 });
    });

    if (userMatching.length < maxCount) {
      const newConnections: string[] = [];
      users.forEach((user) => {
        newConnections.push(...user.connections);
      });
      queue.push({ connections: newConnections, level: level + 1 });
    }
  }

  return [usersByLevel, userMatching];
};

app.post("/getUsersByKeyword/:userId", async (req, res) => {
  try {
    const { keyword } = req.body;
    const userId = req.params.userId;
    if (userId == null) {
      return res.status(400).json({ message: "invalid user or keyword" });
    }
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    const connectionSet = new Set(user.connections);
    const sendConnectionSet = new Set(user.sentConnectionRequests);
    const connectionRequestSet = new Set(user.connectionRequests);

    console.log(keyword, "keyword");
    const [usersByLevel, userMatching] = await getUserByConnectionsBFS(
      userId,
      50,
      keyword || ""
    );
    let setofId = new Set();
    const nuser = [];
    for (let i = 0; i < userMatching.length; i++) {
      for (let j = 0; j < userMatching[i].length; j++) {
        const curid = userMatching[i][j]?.id;
        if (connectionSet.has(curid)) {
          nuser.push({
            ...userMatching[i][j],
            connectionStatus: "connected",
          });
        } else if (sendConnectionSet.has(curid)) {
          nuser.push({
            ...userMatching[i][j],
            connectionStatus: "sent",
          });
        } else if (connectionRequestSet.has(curid)) {
          nuser.push({
            ...userMatching[i][j],
            connectionStatus: "received",
          });
        } else if (curid !== userId) {
          nuser.push({
            ...userMatching[i][j],
            connectionStatus: "new",
          });
        }
        setofId.add(curid);
      }
    }
    if (nuser.length < 50) {
      const nusers = await prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { name: { contains: keyword, mode: "insensitive" } },
                { headline: { contains: keyword, mode: "insensitive" } },
                { industry: { contains: keyword, mode: "insensitive" } },
                { email: { contains: keyword, mode: "insensitive" } },
                { city: { contains: keyword, mode: "insensitive" } },
                { country: { contains: keyword, mode: "insensitive" } },
                { additionalName: { contains: keyword, mode: "insensitive" } },
                { userDescription: { contains: keyword, mode: "insensitive" } },
              ],
            },
            { id: { notIn: [...setofId] as string[] } },
          ],
        },
        select: {
          id: true,
          name: true,
          profileImage: true,
          headline: true,
          industry: true,
          email: true,
        },
        take: 50 - nuser.length,
      });
      for (let i = 0; i < nusers.length; i++) {
        const curid = nusers[i]?.id;
        if (connectionSet.has(curid)) {
          nuser.push({
            ...nusers[i],
            connectionStatus: "connected",
          });
        } else if (sendConnectionSet.has(curid)) {
          nuser.push({
            ...nusers[i],
            connectionStatus: "sent",
          });
        } else if (connectionRequestSet.has(curid)) {
          nuser.push({
            ...nusers[i],
            connectionStatus: "received",
          });
        } else if (curid !== userId) {
          nuser.push({
            ...nusers[i],
            connectionStatus: "new",
          });
        }
      }
    }
    res.status(200).json({ users: nuser });
  } catch (err) {
    res.status(500).json({ message: "error getting users" });
  }
});

// these end points are used to populate my database
app.get("/deleteDataBase/:password", async (req, res) => {
  try {
    const password = req.params.password;
    console.log(password);
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    await prisma.user.deleteMany();
    await prisma.post.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.room.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.website.deleteMany();
    await prisma.education.deleteMany();
    // await prisma.job.deleteMany();
    // await prisma.applyOption.deleteMany();
    // await prisma.jobHighlights.deleteMany();
    // await prisma.jobRequiredEducation.deleteMany();
    // await prisma.jobRequiredExperience.deleteMany();
    res.send({ messege: "database deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "error deleting database" });
  }
});

app.get("/populate/:password", async (req, res) => {
  try {
    const password = req.params.password;
    console.log(password);
    const url = process.env.RANDOM_USER_API || "";
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    const male = await axios.get(url, {
      params: {
        results: 250,
        gender: "female",
      },
    });
    const female = await axios.get(url, {
      params: {
        results: 250,
        gender: "male",
      },
    });
    const allUsers = [...male.data.results, ...female.data.results];
    for (let i = allUsers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allUsers[i], allUsers[j]] = [allUsers[j], allUsers[i]];
    }
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      addUser(user);
    }
    res.send({
      messege: `total ${male.data.results.length} male and ${female.data.results.length} female`,
    });
  } catch (err) {
    res.status(500).json({ message: "error populating database" });
  }
});

app.get("/populatePost/:password", async (req, res) => {
  try {
    const password = req.params.password;
    const url = process.env.RANDOM_POSTS_API || "";
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    const randomImages: any[] = [];
    for (let i = 0; i < 30; i++) {
      const Images: any = await axios.get(url, {
        params: {
          count: 30,
          page: i,
        },
      });
      randomImages.push(...Images.data);
    }
    const users = await prisma.user.findMany({
      select: {
        id: true,
      },
    });

    const totalUsers = users.length;
    for (let i = 0; i < randomImages.length; i++) {
      const randomUser = Math.floor(Math.random() * totalUsers);
      const user = users[randomUser];
      addPost(randomImages[i], user.id);
    }
    res.status(200).json({ message: "populating posts" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "error populating posts" });
  }
});

app.get("/populateSendRequest/:email/:password", async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    try {
      const userId = user?.id || "";
      console.log(userId);
      receiveConnectionsRequest(userId);
    } catch (err) {
      res.status(500).json({ message: "error populating requests" });
    }
    res.status(200).json({ message: "populating requests" + user.id });
  } catch (err) {
    res.status(500).json({ message: "error populating requests" });
  }
});

app.get("/populateRequest/:email/:password", async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    try {
      const userId = user?.id || "";
      console.log(userId);
      giveConnectionsRequest(userId);
    } catch (err) {
      res.status(500).json({ message: "error populating requests" });
    }
    res.status(200).json({ message: "populating requests" + user.id });
  } catch (err) {
    res.status(500).json({ message: "error populating requests" });
  }
});

app.get("/populateConnection/:email/:password", async (req, res) => {
  try {
    const email = req.params.email;
    const password = req.params.password;
    const admin_password = process.env.ADMIN_PASSWORD;
    if (password !== admin_password) {
      return res.status(400).json({ message: "invalid password" });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return res.status(400).json({ message: "invalid user" });
    }
    try {
      const userId = user?.id;
      await acceptConnectionsRequest(userId);
    } catch (err) {
      res.status(500).json({ message: "error populating connections" });
    }
    res.status(200).json({ message: "populating connections for" + user.id });
  } catch (err) {
    res.status(500).json({ message: "error populating connections" });
  }
});
