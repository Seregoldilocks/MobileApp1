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

const existingUsers = ["test@example.com", "user@gmail.com"];

const RegisterScreen = () => {
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

  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const navigation = useNavigation();

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const validateEmail = (text) => {
    setEmail(text);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError(!text ? "" : emailRegex.test(text) ? "" : "Invalid email format");
  };

  const handleRegister = () => {
    if (!userType) {
      Alert.alert("Error", "Please select your role.");
      return;
    }
    if (!firstName || !lastName || !contactNumber || !address || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }
    if (existingUsers.includes(email)) {
      Alert.alert("Error", "This email is already registered. Try logging in.");
      return;
    }
    if (emailError || passwordError || confirmPasswordError) {
      Alert.alert("Error", "Please fix validation errors before submitting.");
      return;
    }
    Alert.alert("Success", "Registration Successful! Your account has been created.");
    navigation.navigate("Login");
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/register.png")} style={styles.logo} />
        </View>

        <Text style={styles.title}>REGISTER</Text>
        <Text style={styles.instructions}>Create your account to start using our services.</Text>

        {/* User Type Selection */}
        <Text style={styles.label}>User Type:</Text>
        <View style={styles.userTypeContainer}>
          <TouchableOpacity
            style={[styles.userTypeOption, userType === "Owner" && styles.selectedOption]}
            onPress={() => setUserType("Owner")}
          >
            <Text>Owner</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.userTypeOption, userType === "Caretaker" && styles.selectedOption]}
            onPress={() => setUserType("Caretaker")}
          >
            <Text>Caretaker</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name:</Text>
          <TextInput placeholder="Enter your first name" value={firstName} onChangeText={setFirstName} style={styles.input} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name:</Text>
          <TextInput placeholder="Enter your last name" value={lastName} onChangeText={setLastName} style={styles.input} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>Back to Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContainer: { paddingHorizontal: 24, paddingVertical: 20 },
  logo: { width: 90, height: 90, alignSelf: "center", marginBottom: 20 },
  title: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  instructions: { fontSize: 13, textAlign: "center", color: "#666", marginBottom: 10 },
  label: { fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 4, marginTop: 8 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
  userTypeContainer: { flexDirection: "row", justifyContent: "space-around", marginVertical: 10 },
  userTypeOption: { padding: 12, borderRadius: 10, borderWidth: 1, backgroundColor: "#ddd" },
  selectedOption: { backgroundColor: "#81C784" },
  button: { backgroundColor: "#81C784", padding: 10, borderRadius: 20, alignItems: "center", marginTop: 10 },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  linkText: { color: "#007bff", fontSize: 14, textAlign: "center", marginTop: 20 },
});

export default RegisterScreen;