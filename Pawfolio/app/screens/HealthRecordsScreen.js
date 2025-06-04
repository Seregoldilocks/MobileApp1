import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-toast-message";

// Dummy pet database (simulate fetching from Firebase)
const fetchPetsFromDatabase = () => {
  return ["Buddy", "Whiskers", "Max"];
};

export default function HealthRecordsScreen() {
  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState("All");
  const [pets, setPets] = useState([]);
  const [recordData, setRecordData] = useState({
    type: "",
    vet: "",
    notes: "",
    date: new Date().toISOString().split("T")[0],
    petName: "",
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const petData = fetchPetsFromDatabase();
    setPets(["All", ...petData]);
  }, []);

  const handleAddRecord = () => {
    if (!recordData.type || !recordData.vet || !recordData.notes || !recordData.petName || !recordData.date) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setRecords([...records, { ...recordData, id: String(Date.now()) }]);
    setModalVisible(false);
    setRecordData({ type: "", vet: "", notes: "", date: new Date().toISOString().split("T")[0], petName: "" });
    Toast.show({ type: "success", text1: "Health Record Added Successfully!" });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Record", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        setRecords(records.filter((record) => record.id !== id));
        Toast.show({ type: "success", text1: "Record Deleted Successfully!" });
      }},
    ]);
  };

  const filteredRecords = records.filter(
    (record) => (selectedPet === "All" || record.petName === selectedPet) && record.date === selectedDate
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Records</Text>

      <Text style={styles.label}>Filter by Pet:</Text>
      <FlatList
        horizontal
        data={pets}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.petOption, selectedPet === item && styles.selectedOption]}
            onPress={() => setSelectedPet(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.label}>Filter by Date:</Text>
      <DateTimePicker
        value={new Date(selectedDate)}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setSelectedDate(selectedDate.toISOString().split("T")[0]);
        }}
      />

      <TextInput
        style={styles.searchBar}
        placeholder="Search records..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredRecords.filter((record) => record.type.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.petName} - {item.type}</Text>
            <Text>Vet: {item.vet}</Text>
            <Text>Notes: {item.notes}</Text>
            <Text>Date: {item.date}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Record</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Health Record</Text>

          <Text style={styles.label}>Select Pet:</Text>
          <FlatList
            horizontal
            data={pets.filter((pet) => pet !== "All")}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.petOption, recordData.petName === item && styles.selectedOption]} 
                onPress={() => setRecordData({ ...recordData, petName: item })}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.label}>Record Type:</Text>
          <TextInput style={styles.input} placeholder="Vaccination, Checkup, etc." value={recordData.type} onChangeText={(text) => setRecordData({ ...recordData, type: text })} />

          <Text style={styles.label}>Vet Name:</Text>
          <TextInput style={styles.input} placeholder="Enter vet name" value={recordData.vet} onChangeText={(text) => setRecordData({ ...recordData, vet: text })} />

          <Text style={styles.label}>Notes:</Text>
          <TextInput style={styles.input} placeholder="Enter any notes" value={recordData.notes} onChangeText={(text) => setRecordData({ ...recordData, notes: text })} />

          <Text style={styles.label}>Date:</Text>
          <DateTimePicker
            value={new Date(recordData.date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setRecordData({ ...recordData, date: selectedDate.toISOString().split("T")[0] });
            }}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddRecord}>
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
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  searchBar: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
  card: { backgroundColor: "#fff", padding: 15, borderRadius: 10, marginBottom: 10 },
  deleteButton: { backgroundColor: "red", padding: 8, borderRadius: 8, marginTop: 5, alignItems: "center" },
  addButton: { backgroundColor: "#007bff", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },

  modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.6)", padding: 20 },
  modalTitle: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#fff", marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 5 },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 10 },
});