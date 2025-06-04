import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import LoginScreen from "./LoginScreen";
import ForgotPasswordScreen from "./ForgotPasswordScreen";
import RegisterScreen from "./RegisterScreen";
import Dashboard from "./Dashboard";
import PetManagementScreen from "./screens/PetManagementScreen";
import FeedingLogScreen from "./screens/FeedingLogScreen";
import ActivityLogScreen from "./screens/ActivityLogScreen";
import HealthRecordsScreen from "./screens/HealthRecordsScreen";
// import HomeDrawer from "./navigation/HomeDrawer";

const Stack = createStackNavigator();

export default function App() {
  return (
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Authentication Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />

        {/* Dashboard & Management Screens */}
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="PetManagementScreen" component={PetManagementScreen} />
        <Stack.Screen name="FeedingLogScreen" component={FeedingLogScreen} />
        <Stack.Screen name="ActivityLogScreen" component={ActivityLogScreen} />
        <Stack.Screen name="HealthRecordsScreen" component={HealthRecordsScreen} />

        {/* Optional: Uncomment when ready to use HomeDrawer */}
        {/* <Stack.Screen name="HomeDrawer" component={HomeDrawer} /> */}
      </Stack.Navigator>
  );
}
