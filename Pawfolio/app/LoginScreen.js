import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const LoginScreen = () => {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  // ✅ All hooks declared at the top before any return
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError(""); // Remove alert when empty
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    if (emailError) {
      Alert.alert("Error", "Please enter a valid email.");
      return;
    }

    // Proceed with successful login
    Toast.show({
      type: "success",
      text1: "Login Successful",
      text2: "Welcome back!",
    });

    navigation.navigate("Dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/images/logo.png")}
        style={styles.logo}
      />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address:</Text>
        <TextInput
          placeholder="Enter your email"
          value={email}
          onChangeText={validateEmail}
          style={styles.input}
        />
        {emailError ? (
          <Text style={styles.errorText}>{emailError}</Text>
        ) : null}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password:</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
            style={styles.inputFlex}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons
              name={isPasswordVisible ? "eye" : "eye-off"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("ForgotPassword")}>
        <Text style={styles.linkText}>Forgot password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Register")}
        style={{ marginTop: 20 }}
      >
        <Text style={styles.linkText2}>
          Don’t have an account?{" "}
          <Text style={styles.linkHighlight}>Register</Text>
        </Text>
      </TouchableOpacity>

      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f8f9fa",
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: "center",
    marginBottom: 20,
    borderRadius: 20,
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 4,
    marginTop: 8,
    fontFamily: "PoppinsBold",
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "PoppinsRegular",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "PoppinsRegular",
  },
  button: {
    backgroundColor: "#81C784",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "PoppinsBold",
    fontSize: 16,
  },
  linkText: {
    color: "#007bff",
    fontSize: 13,
    textAlign: "right",
    marginTop: 0,
    marginBottom: 15,
    fontFamily: "PoppinsRegular",
  },
  linkText2: {
    color: "#007bff",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
    fontFamily: "PoppinsRegular",
  },
  linkHighlight: {
    fontWeight: "700",
    fontFamily: "PoppinsBold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
});

export default LoginScreen;
