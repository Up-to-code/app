import { router, Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopWidth: 1,
          borderTopColor: "#E0E0E0",
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "#8E8E93",
        headerStyle: {
          backgroundColor: "#FFFFFF",
          borderBottomWidth: 1,
          borderBottomColor: "#E0E0E0",
        },
        headerTitleStyle: {
          color: "#000000",
          fontWeight: "600",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        header: ({ route }) => (
          <Header
            title={
              route.name === "home"
                ? "Home"
                : route.name === "list"
                ? "List"
                : route.name === "create"
                ? "Create"
                : "Profile"
            }
            logo={["home", "list"].includes(route.name)}
            rightIcon={route.name === "home" ? "search" : route.name === "list" ? "search" : "repeat"}
            leftIcon={route.name === "profile" ? "cog" : null}
            onRightPress={() => {
              if (["home", "list"].includes(route.name)) {
                router.push("/search");
              } else if (route.name === "create") {
                // Add functionality for create screen's right icon press
              }
            }}
            onLeftPress={() => {
              if (route.name === "profile") {
                router.push("/settings");
              }
            }}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
          title: "Chat",
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
};

export default Layout;
