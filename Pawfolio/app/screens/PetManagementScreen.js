import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Modal } from "react-native";
import Toast from "react-native-toast-message";

export default function PetManagementScreen() {
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [petData, setPetData] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
    birthday: "",
    weight: "",
  });

  const handleAddPet = () => {
    if (!petData.name || !petData.type || !petData.breed || !petData.gender || !petData.birthday || !petData.weight) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setPets([...pets, { ...petData, id: String(Date.now()) }]);
    setModalVisible(false);
    setPetData({ name: "", type: "", breed: "", gender: "", birthday: "", weight: "" });
    Toast.show({ type: "success", text1: "Pet Added Successfully!" });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Pet", "Are you sure you want to delete this pet?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        setPets(pets.filter((pet) => pet.id !== id));
        Toast.show({ type: "success", text1: "Pet Deleted Successfully!" });
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pet Management</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search pets..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={pets.filter((pet) => pet.name.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.petName}>{item.name} ({item.type})</Text>
            <Text>{item.breed} | {item.gender} | {item.birthday} | {item.weight}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Pet</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Pet</Text>

          <Text style={styles.label}>Name:</Text>
          <TextInput style={styles.input} placeholder="Enter pet's name" value={petData.name} onChangeText={(text) => setPetData({ ...petData, name: text })} />

          <Text style={styles.label}>Type:</Text>
          <TextInput style={styles.input} placeholder="Enter pet type" value={petData.type} onChangeText={(text) => setPetData({ ...petData, type: text })} />

          <Text style={styles.label}>Breed:</Text>
          <TextInput style={styles.input} placeholder="Enter breed" value={petData.breed} onChangeText={(text) => setPetData({ ...petData, breed: text })} />

          <Text style={styles.label}>Gender:</Text>
          <TextInput style={styles.input} placeholder="Enter gender" value={petData.gender} onChangeText={(text) => setPetData({ ...petData, gender: text })} />

          <Text style={styles.label}>Birthday:</Text>
          <TextInput style={styles.input} placeholder="Enter birthday" value={petData.birthday} onChangeText={(text) => setPetData({ ...petData, birthday: text })} />

          <Text style={styles.label}>Weight:</Text>
          <TextInput style={styles.input} placeholder="Enter weight" value={petData.weight} onChangeText={(text) => setPetData({ ...petData, weight: text })} />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddPet}>
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f9fa" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  searchBar: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  petName: { fontSize: 18, fontWeight: "bold" },
  deleteButton: { backgroundColor: "red", padding: 8, borderRadius: 8, marginTop: 5, alignItems: "center" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },

  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)", padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#fff", marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10 },

  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  cancelButton: { backgroundColor: "#E57373", padding: 12, borderRadius: 10, alignItems: "center" },
  saveButton: { backgroundColor: "#81C784", padding: 12, borderRadius: 10, alignItems: "center" },
});
