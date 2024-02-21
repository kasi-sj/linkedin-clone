import { Tabs } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

export default function Layout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "grey" },
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Entypo name="home" size={24} color="black" />;
            } else {
              return <AntDesign name="home" size={24} color="grey" />;
            }
          },
        }}
      />
      <Tabs.Screen
        name="network"
        options={{
          tabBarLabel: "Network",
          tabBarLabelStyle: { color: "grey" },
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="people" size={24} color="black" />;
            } else {
              return <Ionicons name="people-outline" size={24} color="grey" />;
            }
          },
        }}
      />
      <Tabs.Screen
        name="post"
        options={{
          tabBarLabel: "Post",
          tabBarLabelStyle: { color: "grey" },
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <AntDesign name="plussquare" size={24} color="black" />;
            } else {
              return <AntDesign name="plussquareo" size={24} color="grey" />;
            }
          },
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: "Notification",
          tabBarLabelStyle: { color: "grey" },
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="notifications" size={24} color="black" />;
            } else {
              return (
                <Ionicons name="notifications-outline" size={24} color="grey" />
              );
            }
          },
        }}
      />
      <Tabs.Screen
        name="jobs"
        options={{
          tabBarLabel: "Jobs",
          tabBarLabelStyle: { color: "grey" },
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            if (focused) {
              return <Ionicons name="briefcase" size={24} color="black" />;
            } else {
              return (
                <Ionicons name="briefcase-outline" size={24} color="grey" />
              );
            }
          },
        }}
      />
    </Tabs>
  );
}
