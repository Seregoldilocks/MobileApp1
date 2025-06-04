import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from "react-native-toast-message";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Animatable from "react-native-animatable";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";

export default function PetManagementScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [petData, setPetData] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    birthday: "",
    weight: "",
  });
  const [weightError, setWeightError] = useState(false);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const handleAddPet = () => {
    if (
      !petData.name ||
      !petData.type ||
      !petData.breed ||
      !petData.gender ||
      !petData.birthday ||
      !petData.weight
    ) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setPets([...pets, { ...petData, id: String(Date.now()) }]);
    setModalVisible(false);
    setPetData({
      name: "",
      type: "",
      breed: "",
      gender: "",
      birthday: "",
      weight: "",
    });
    Toast.show({ type: "success", text1: "Pet Added Successfully!" });
    setWeightError(false);
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Pet", "Are you sure you want to delete this pet?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setPets(pets.filter((pet) => pet.id !== id));
          Toast.show({ type: "success", text1: "Pet Deleted Successfully!" });
        },
      },
    ]);
  };

  const onChangeBirthday = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const date = selectedDate.toISOString().split("T")[0];
      setPetData({ ...petData, birthday: date });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Management</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search pets..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#666"
        />
      </View>

      {pets.length === 0 && (
        <View style={styles.noPetsContainer}>
          <Text style={styles.noPetsText}>No pets registered yet.</Text>
        </View>
      )}

      <FlatList
        data={pets.filter((pet) =>
          pet.name.toLowerCase().includes(search.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
            <Image
              source={
                item.type.toLowerCase() === "dog"
                  ? require("../../assets/images/dog.png")
                  : require("../../assets/images/cat.png")
              }
              style={styles.petImage}
            />
            <Text style={styles.petName}>
              {item.name} ({item.type})
            </Text>
            <Text style={styles.petDetails}>
              {item.breed} | {item.gender} | {item.birthday} | {item.weight} kg
            </Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />

      
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Pet</Text>
      </TouchableOpacity>

      {/* ← Back to Home text button */}
      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Add a New Pet</Text>

            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter pet's name"
              placeholderTextColor="#666"
              value={petData.name}
              onChangeText={(text) => setPetData({ ...petData, name: text })}
            />

            <Text style={styles.label}>Type of Pet:</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={petData.type}
                onValueChange={(itemValue) =>
                  setPetData({ ...petData, type: itemValue })
                }
                style={styles.picker}
              >
                <Picker.Item label="Select type" value="" />
                <Picker.Item label="Dog" value="Dog" />
                <Picker.Item label="Cat" value="Cat" />
              </Picker>
            </View>

            <Text style={styles.label}>Breed:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter breed"
              placeholderTextColor="#666"
              value={petData.breed}
              onChangeText={(text) => setPetData({ ...petData, breed: text })}
            />

            <Text style={styles.label}>Gender:</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setPetData({ ...petData, gender: "Male" })}
              >
                <View
                  style={[
                    styles.radioCircle,
                    petData.gender === "Male" && styles.selectedRadio,
                  ]}
                />
                <Text style={styles.radioText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setPetData({ ...petData, gender: "Female" })}
              >
                <View
                  style={[
                    styles.radioCircle,
                    petData.gender === "Female" && styles.selectedRadio,
                  ]}
                />
                <Text style={styles.radioText}>Female</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Birthday:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text
                style={{
                  color: petData.birthday ? "#000" : "#666",
                  fontFamily: "PoppinsRegular",
                }}
              >
                {petData.birthday || "Select birthday"}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={onChangeBirthday}
              />
            )}

            <Text style={styles.label}>Weight (kg):</Text>
            <TextInput
              style={[styles.input, weightError && { borderColor: "red" }]}
              placeholder="Enter weight"
              placeholderTextColor="#666"
              value={petData.weight}
              keyboardType="numeric"
              onChangeText={(text) => {
                if (/^\d*\.?\d*$/.test(text)) {
                  setPetData({ ...petData, weight: text });
                  setWeightError(false);
                } else {
                  setWeightError(true);
                }
              }}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddPet}
              >
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f1f8e9" },
  title: {
    fontSize: 24,
    fontFamily: "PoppinsBold",
    marginBottom: 10,
    textAlign: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
  },
  searchIcon: { paddingHorizontal: 10 },
  searchBar: {
    flex: 1,
    padding: 12,
    color: "#666",
    fontFamily: "PoppinsRegular",
    fontSize: 15,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#FFF176",
    marginBottom: 10,
  },
  petName: { fontSize: 18, fontFamily: "PoppinsBold" },
  petDetails: { fontFamily: "PoppinsRegular", color: "#444" },
  deleteButton: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 8,
    marginTop: 5,
    alignItems: "center",
  },
  deleteText: { color: "white", fontFamily: "PoppinsBold" },
  addButton: {
    backgroundColor: "#81C784",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "PoppinsBold",
  },

  backLink: {
    fontSize: 16,
    fontFamily: "PoppinsBold",
    color: "#007AFF",
    textAlign: "center",
    marginTop: 15,
  },

  modalContainer: { flex: 1, backgroundColor: "#f1f8e9", padding: 20 },
  modalTitle: {
    fontSize: 22,
    fontFamily: "PoppinsBold",
    textAlign: "center",
    marginBottom: 15,
  },
  label: { fontSize: 16, fontFamily: "PoppinsBold", marginBottom: 5 },
  input: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#ccc",
    color: "#000",
    fontFamily: "PoppinsRegular",
  },

  pickerWrapper: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
    borderColor: "#ccc",
  },
  picker: { paddingVertical: 4 },

  genderContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  radioButton: { flexDirection: "row", alignItems: "center" },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  selectedRadio: { backgroundColor: "#666" },
  radioText: {
    fontSize: 16,
    color: "#666",
    fontFamily: "PoppinsRegular",
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: { backgroundColor: "#E57373" },
  saveButton: { backgroundColor: "#81C784" },
  buttonText: { color: "white", fontFamily: "PoppinsBold" },

  noPetsContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  noPetsText: {
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    color: "#666",
  },
});
