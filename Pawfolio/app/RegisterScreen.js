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
import { Picker } from "@react-native-picker/picker";
import { useFonts } from "expo-font";

const existingUsers = ["test@example.com", "user@gmail.com"];

const RegisterScreen = () => {
  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../assets/fonts/Poppins-Bold.ttf"),
  });

  const navigation = useNavigation();

  const [userType, setUserType] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const isValidPassword = (password) => {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleChange = (field, value) => {
    switch (field) {
      case "firstName":
        setFirstName(value);
        setErrors((prev) => ({
          ...prev,
          firstName: value ? "" : "First name is required.",
        }));
        break;
      case "lastName":
        setLastName(value);
        setErrors((prev) => ({
          ...prev,
          lastName: value ? "" : "Last name is required.",
        }));
        break;
      case "contactNumber":
        setContactNumber(value);
        setErrors((prev) => ({
          ...prev,
          contactNumber: value ? "" : "Contact number is required.",
        }));
        break;
      case "address":
        setAddress(value);
        setErrors((prev) => ({
          ...prev,
          address: value ? "" : "Address is required.",
        }));
        break;
      case "email":
        setEmail(value);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailError = !value
          ? ""
          : !emailRegex.test(value)
          ? "Invalid email format"
          : existingUsers.includes(value)
          ? "This email is already registered."
          : "";
        setErrors((prev) => ({ ...prev, email: emailError }));
        break;
      case "password":
        setPassword(value);
        const passwordError = !value
          ? ""
          : !isValidPassword(value)
          ? "Password must be 8+ characters with a letter, number, and special character."
          : "";
        setErrors((prev) => ({ ...prev, password: passwordError }));
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        const confirmError = !value
          ? ""
          : value !== password
          ? "Passwords do not match."
          : "";
        setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
        break;
      default:
        break;
    }

    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleRegister = () => {
    const newErrors = {};

    if (!userType) newErrors.userType = "Please select a user type.";
    if (!firstName) newErrors.firstName = "First name is required.";
    if (!lastName) newErrors.lastName = "Last name is required.";
    if (!contactNumber) newErrors.contactNumber = "Contact number is required.";
    if (!address) newErrors.address = "Address is required.";
    if (!email) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Please confirm your password.";
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      Alert.alert("Success", "Registration Successful! Your account has been created.");
      navigation.navigate("Login");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Image source={require("../assets/images/register.png")} style={styles.logo} />
        </View>

        <Text style={styles.title}>REGISTER</Text>
        <Text style={styles.instructions}>Create your account to start using our services.</Text>

        {/* User Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label1}>User Type:</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={userType}
              onValueChange={(itemValue) => {
                setUserType(itemValue);
                setTouched((prev) => ({ ...prev, userType: true }));
                setErrors((prev) => ({
                  ...prev,
                  userType: itemValue ? "" : "Please select a user type.",
                }));
              }}
              style={styles.picker}
            >
              <Picker.Item label="Select User Type" value="" style={styles.pickerlabel} />
              <Picker.Item label="Owner" value="Owner" />
              <Picker.Item label="Caretaker" value="Caretaker" />
            </Picker>
          </View>
          {touched.userType && errors.userType ? <Text style={styles.errorText}>{errors.userType}</Text> : null}
        </View>

        {/* Text Fields */}
        {[
          { label: "First Name", value: firstName, field: "firstName" },
          { label: "Last Name", value: lastName, field: "lastName" },
          { label: "Contact Number", value: contactNumber, field: "contactNumber", keyboardType: "phone-pad" },
          { label: "Address", value: address, field: "address" },
          { label: "Email Address", value: email, field: "email", keyboardType: "email-address" },
        ].map(({ label, value, field, keyboardType }) => (
          <View style={styles.inputContainer} key={field}>
            <Text style={styles.label}>{label}:</Text>
            <TextInput
              value={value}
              onChangeText={(text) => handleChange(field, text)}
              placeholder={`Enter your ${label.toLowerCase()}`}
              style={styles.input}
              keyboardType={keyboardType || "default"}
            />
            {touched[field] && errors[field] ? <Text style={styles.errorText}>{errors[field]}</Text> : null}
          </View>
        ))}

        {/* Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={password}
              onChangeText={(text) => handleChange("password", text)}
              placeholder="Enter your password"
              secureTextEntry={!isPasswordVisible}
              style={styles.inputPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
              <Ionicons name={isPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {touched.password && errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
        </View>

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm Password:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              value={confirmPassword}
              onChangeText={(text) => handleChange("confirmPassword", text)}
              placeholder="Confirm your password"
              secureTextEntry={!isConfirmPasswordVisible}
              style={styles.inputPassword}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}>
              <Ionicons name={isConfirmPasswordVisible ? "eye-off" : "eye"} size={24} color="gray" />
            </TouchableOpacity>
          </View>
          {touched.confirmPassword && errors.confirmPassword ? (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          ) : null}
        </View>

        {/* Register Button */}
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
  instructions: { marginBottom: 20, textAlign: "center", color: "#666", fontSize: 14 },
  inputContainer: { marginBottom: 14 },
  label: { fontSize: 14, fontWeight: "bold", color: "#444" },
  label1: { fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 4 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginTop: 4,
  },
  inputPassword: {
    flex: 1,
    padding: 12,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
  },
  picker: {
    backgroundColor: "#fff",
  },
  pickerlabel: {
    color: "#666",
    fontSize: 14,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    paddingRight: 10,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#81C784",
    padding: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  linkText: { color: "#007bff", fontSize: 14, textAlign: "center", marginTop: 20 },
  errorText: { color: "red", fontSize: 12, marginTop: 4 },
});

export default RegisterScreen;
