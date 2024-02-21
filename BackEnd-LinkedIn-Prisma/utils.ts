import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import axios from "axios";

const arrayOfStrings = [
  "It feels like a moment frozen in time, filled with wonder.",
  "This scene beckons with promises of adventure and discovery.",
  "Who wouldn't be captivated by such a captivating sight?",
  "Imagine yourself immersed in the beauty of this moment.",
  "It evokes a sense of awe and admiration, leaving you breathless.",
  "This image invites you to explore the depths of your imagination.",
  "Who could resist the allure of such boundless possibilities?",
  "It's like stepping into a world of endless wonder and enchantment.",
  "This picture captures the essence of pure magic and wonder.",
  "Who wouldn't want to get lost in the enchanting beauty of this scene?",
  "It feels like a dream come true, a moment of pure bliss.",
  "This scene radiates with warmth and joy, filling your heart with happiness.",
  "Who wouldn't be drawn to such a radiant display of beauty?",
  "Imagine yourself basking in the glow of this beautiful moment.",
  "It evokes a sense of joy and contentment, lifting your spirits.",
  "This image invites you to embrace the beauty of life's simple pleasures.",
  "Who could resist the charm of such a delightful scene?",
  "It's like stepping into a world filled with endless possibilities and joy.",
  "This picture captures the magic of everyday moments, making them extraordinary.",
  "Who wouldn't want to be swept away by the sheer joy of this moment?",
  "It feels like a ray of sunshine on a cloudy day, bringing warmth and light.",
  "This scene radiates with positivity and optimism, inspiring hope.",
  "Who wouldn't be uplifted by such a bright and cheerful sight?",
  "Imagine yourself surrounded by the glow of this beautiful moment.",
  "It evokes a sense of optimism and possibility, filling you with renewed energy.",
  "This image invites you to embrace the beauty of life's endless possibilities.",
  "Who could resist the infectious optimism of such a radiant scene?",
  "It's like stepping into a world where every moment is filled with joy and laughter.",
  "This picture captures the essence of pure happiness and positivity.",
  "Who wouldn't want to be surrounded by the warmth and light of this beautiful moment?",
  "It feels like a breath of fresh air, invigorating and revitalizing.",
  "This scene radiates with energy and vitality, filling you with renewed vigor.",
  "Who wouldn't be revitalized by such a vibrant and dynamic sight?",
  "Imagine yourself immersed in the pulse of this exhilarating moment.",
  "It evokes a sense of excitement and possibility, igniting your passion.",
  "This image invites you to embrace the thrill of life's adventures.",
  "Who could resist the pulse-pounding excitement of such an electrifying scene?",
  "It's like stepping into a world where every heartbeat is a promise of adventure.",
  "This picture captures the essence of pure adrenaline and excitement.",
  "Who wouldn't want to feel the rush of adrenaline in this thrilling moment?",
  "It creates the image of a tranquil retreat where you can find peace and tranquility.",
  "This conjures up the atmosphere of a peaceful sanctuary where you can rejuvenate your spirit.",
  "It brings to mind the feeling of a serene hideaway where you can find solace amidst the beauty of nature.",
  "This suggests the ambiance of a cozy haven where you can escape from the stresses of life.",
  "It emits the aura of a peaceful oasis where you can unwind and recharge.",
  "This evokes the atmosphere of a secluded paradise where you can escape from the hustle and bustle of the city.",
  "It radiates the feeling of a tranquil retreat where you can rejuvenate your mind and body.",
  "This exudes the impression of a peaceful sanctuary where you can reconnect with nature.",
  "It emanates the ambiance of a cozy haven where you can escape from the chaos of everyday life.",
  "This gives the feeling of a serene oasis where you can recharge your energy.",
  "It creates the image of a tranquil retreat where you can find peace and tranquility.",
  "This conjures up the atmosphere of a peaceful sanctuary where you can rejuvenate your spirit.",
  "It brings to mind the feeling of a serene hideaway where you can find solace amidst the beauty of nature.",
];

const headlines = [
  "Data Scientist | Machine Learning Expert | AI Enthusiast",
  "Cybersecurity Analyst | Ethical Hacker | Network Defender",
  "Biomedical Engineer | Medical Innovator | Healthcare Technologist",
  "Environmental Scientist | Climate Change Researcher | Eco-Warrior",
  "Robotics Engineer | Automation Specialist | Future Technologist",
  "Space Explorer | Astrophysicist | Cosmic Adventurer",
  "Software Engineer | Web Developer | Code Wizard",
  "Electrical Engineer | Circuit Designer | Power Systems Expert",
  "Blockchain Developer | Cryptocurrency Enthusiast | Decentralization Advocate",
  "UX Designer | UI Specialist | User Experience Guru",
  "Quantum Physicist | Particle Whisperer | Quantum Computing Pioneer",
  "Neuroscientist | Brain Hacker | Cognitive Explorer",
  "Geneticist | DNA Decoder | Gene Editing Pioneer",
  "Renewable Energy Engineer | Sustainability Champion | Clean-Tech Innovator",
  "Virtual Reality Developer | Augmented Reality Creator | Immersive Experience Architect",
  "Astronaut | Space Pioneer | Interstellar Adventurer",
  "Bioinformatics Specialist | Genomic Data Analyst | Computational Biologist",
  "Autonomous Vehicle Engineer | Self-Driving Car Developer | Mobility Innovator",
  "Nanotechnologist | Microscale Magician | Nanoengineering Trailblazer",
  "Game Developer | Gaming Guru | Virtual World Creator",
  "Cryptographer | Encryption Expert | Privacy Advocate",
  "Telecommunications Engineer | Network Architect | Connectivity Specialist",
  "Renewable Energy Analyst | Green Energy Evangelist | Solar Power Proponent",
  "Biohacker | DIY Biologist | Biohacking Enthusiast",
  "Computer Vision Engineer | Image Processing Specialist | Visual Perception Expert",
  "Futurist | Technology Futurologist | Innovation Evangelist",
  "Augmented Reality Designer | Mixed Reality Maven | AR/VR Enthusiast",
  "Data Analyst | Insights Maven | Analytics Wizard",
  "Quantum Computing Engineer | Quantum Algorithm Developer | Quantum Software Architect",
  "Marine Biologist | Ocean Explorer | Aquatic Conservationist",
  "Artificial Intelligence Researcher | Machine Learning Maverick | Deep Learning Expert",
  "Renewable Energy Consultant | Sustainable Solutions Advocate | Green Tech Guru",
  "Cognitive Scientist | Mind Mapper | Neural Network Navigator",
  "Digital Marketing Technologist | SEO Strategist | Online Branding Expert",
  "Medical Robotics Engineer | Surgical Automation Specialist | Healthcare Innovator",
  "Space Systems Engineer | Rocket Scientist | Orbital Dynamics Expert",
  "Bioinformatics Engineer | Computational Genomics Specialist | DNA Data Scientist",
  "Ethical AI Advocate | Responsible AI Ambassador | AI Governance Expert",
  "Renewable Energy Economist | Green Finance Specialist | Sustainable Investments Advisor",
  "Quantum Cryptographer | Secure Quantum Communications Expert | Quantum Key Distribution Pioneer",
  "Environmental Policy Analyst | Sustainability Policy Advisor | Green Legislation Advocate",
  "Human-Computer Interaction Researcher | User Interface Scientist | Interaction Design Expert",
  "Blockchain Solutions Architect | DLT Developer | Decentralized Applications Engineer",
  "Healthcare AI Specialist | Medical Imaging AI Developer | AI-Powered Diagnostics Pioneer",
  "Renewable Energy Project Manager | Clean Energy Deployment Leader | Sustainable Infrastructure Planner",
  "Neural Engineering Researcher | Brain-Computer Interface Pioneer | Neurotechnology Innovator",
  "Quantum Materials Scientist | Quantum Device Fabricator | Quantum Information Scientist",
  "Climate Change Mitigation Specialist | Carbon Footprint Reduction Strategist | Environmental Impact Analyst",
  "Bioethicist | Biomedical Ethics Advisor | Ethical Implications Analyst",
];

export function generatePassword() {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numberChars = "0123456789";
  const specialChars = "@$!%*?&";
  const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;

  const getRandomChar = (charSet: string) => {
    const randomIndex = Math.floor(Math.random() * charSet.length);
    return charSet[randomIndex];
  };

  let password = "";

  // Ensure at least one character from each category
  password += getRandomChar(uppercaseChars);
  password += getRandomChar(lowercaseChars);
  password += getRandomChar(numberChars);
  password += getRandomChar(specialChars);

  // Generate remaining characters randomly
  const remainingLength = 8 - password.length; // Length should be at least 8
  for (let i = 0; i < remainingLength; i++) {
    password += getRandomChar(allChars);
  }

  // Shuffle the password string to randomize the order
  const shuffledPassword = password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
}

const getRandomDescription = () => {
  const n = arrayOfStrings.length;
  const randomIndex = Math.floor(Math.random() * n);
  const randomString = arrayOfStrings[randomIndex];
  return randomString;
};

const addPost = async (item: any, authorID: string) => {
  try {
    const post = await prisma.post.create({
      data: {
        imageUrl: item.urls.regular,
        description: item.alt_description + ", " + getRandomDescription(),
        authorId: authorID,
      },
    });
    await prisma.user.update({
      where: {
        id: authorID,
      },
      data: {
        posts : {
          push : post.id
        }
      },
    });
    return post;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const addUser = async (item: any) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: item.email,
        name: ((item.name.first || "") + " " + (item.name.last || "")).trim(),
        password: generatePassword(),
        profileImage: item.picture.medium,
        headline: headlines[Math.floor(Math.random() * headlines.length)],
        country: item.location.country,
        city: item.location.city,
        verified: true,
      },
    });
    console.log(user);
    return user;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const url = process.env.BACKEND_URL;

const giveConnectionsRequest = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user?.name);
    const connections = user?.connections;
    const sendConnections = user?.sentConnectionRequests;
    const receiveConnections = user?.connectionRequests;
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId,
            },
          },
          {
            id: {
              notIn: connections,
            },
          },
          {
            id: {
              notIn: sendConnections,
            },
          },
          {
            id: {
              notIn: receiveConnections,
            },
          },
        ],
      },
    });
    for (let i = 0; i < 50; i++) {
      const user = users[i];
      const data = {
        currentUserId: userId,
        selectedUserId: user.id,
      };
      try {
        const res = await axios.post(url + "/connection-request", data);
        console.log(res.data.message);
      } catch (e) {
        console.log("error here1");
      }
    }
  } catch (e) {
    console.log("error here 2");
  }
};

const receiveConnectionsRequest = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(user?.name);
    const connections = user?.connections;
    const sendConnections = user?.sentConnectionRequests;
    const receiveConnections = user?.connectionRequests;
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId,
            },
          },
          {
            id: {
              notIn: connections,
            },
          },
          {
            id: {
              notIn: sendConnections,
            },
          },
          {
            id: {
              notIn: receiveConnections,
            },
          },
        ],
      },
    });
    for (let i = 0; i < 50; i++) {
      const user = users[i];
      const data = {
        currentUserId: user.id,
        selectedUserId: userId,
      };
      try {
        const res = await axios.post(url + "/connection-request", data);
        console.log(res.data.message);
      } catch (e) {
        console.log("error here1");
      }
    }
  } catch (e) {
    console.log("error here 2");
  }
};

const acceptConnectionsRequest = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  const requests = user?.sentConnectionRequests;
  if (!requests) {
    return;
  }
  // "/connection-request/option"
  for (let i = 0; i < requests.length; i++) {
    const data = {
      receiverId: requests[i],
      senderId: userId,
      option: "accept",
    };
    try {
      const res = await axios.post(url + "/connection-request/option", data);
      console.log(res.data.message);
    } catch (e: any) {
      console.log(e.message);
    }
  }
};

export { addPost, addUser, giveConnectionsRequest, acceptConnectionsRequest , receiveConnectionsRequest};
