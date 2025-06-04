import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";

const ForgotPasswordScreen = () => {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

 if (!fontsLoaded) {
     return (
       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
         <Text>Loading fonts...</Text>
       </View>
     );
   }
 

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!text) {
      setEmailError("");
    } else if (!emailRegex.test(text)) {
      setEmailError("Invalid email format");
    } else {
      setEmailError("");
    }
  };

  const handlePasswordChange = (text) => {
    setNewPassword(text);
    if (!text) {
      setPasswordError("");
    } else if (!isValidPassword(text)) {
      setPasswordError("Password must be 8+ characters, include numbers & special characters.");
    } else {
      setPasswordError("");
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (!text) {
      setConfirmPasswordError("");
    } else if (text !== newPassword) {
      setConfirmPasswordError("Passwords do not match.");
    } else {
      setConfirmPasswordError("");
    }
  };

  const handleResetPassword = () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    if (emailError || passwordError || confirmPasswordError) {
      Alert.alert("Error", "Please correct validation errors before submitting.");
      return;
    }

    Alert.alert("Success", "Password reset successful!");
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={require("../assets/images/forgot.png")} style={styles.logo} />

        <Text style={styles.title}>FORGOT PASSWORD</Text>
        <Text style={styles.instructions}>Enter your email and a new password to reset your login credentials.</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address:</Text>
          <TextInput placeholder="Enter your email" value={email} onChangeText={validateEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Enter new password" value={newPassword} onChangeText={handlePasswordChange} secureTextEntry={!isPasswordVisible} style={styles.inputFlex} />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput placeholder="Re-enter new password" value={confirmPassword} onChangeText={handleConfirmPasswordChange} secureTextEntry={!isPasswordVisible} style={styles.inputFlex} />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {confirmPasswordError ? <Text style={styles.errorText}>{confirmPasswordError}</Text> : null}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
          <Text style={styles.buttonText}>Reset Password</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
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
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "PoppinsBold",
    marginBottom: 10,
  },
  instructions: {
    fontSize: 13,
    textAlign: "center",
    color: "#666",
    fontFamily: "PoppinsRegular",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "PoppinsBold",
    color: "#444",
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    fontFamily: "PoppinsRegular",
    marginBottom: 12,
    fontSize: 13,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 12,
  },
  inputFlex: {
    flex: 1,
    paddingVertical: 12,
    fontFamily: "PoppinsRegular",
  },
  button: {
    backgroundColor: "#81C784",
    padding: 5,
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
    fontSize: 14,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    fontFamily: "PoppinsRegular",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    fontFamily: "PoppinsRegular",
  },
});

export default ForgotPasswordScreen;