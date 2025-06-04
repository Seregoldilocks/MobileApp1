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
  return ["Buddy", "Whiskers", "Max"]; // Example pets
};

export default function ActivityLogScreen() {
  const [activities, setActivities] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPet, setSelectedPet] = useState("All"); // Default selection
  const [pets, setPets] = useState([]); // Holds list of pets
  const [activityData, setActivityData] = useState({
    type: "",
    duration: "",
    time: "",
    petName: "",
    date: new Date().toISOString().split("T")[0], // Default to today's date
  });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const petData = fetchPetsFromDatabase();
    setPets(["All", ...petData]); // Include "All" option
  }, []);

  const handleAddActivity = () => {
    if (!activityData.type || !activityData.duration || !activityData.time || !activityData.petName) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setActivities([...activities, { ...activityData, id: String(Date.now()) }]);
    setModalVisible(false);
    setActivityData({ type: "", duration: "", time: "", petName: "", date: new Date().toISOString().split("T")[0] });
    Toast.show({ type: "success", text1: "Activity Added Successfully!" });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Activity", "Are you sure you want to delete this activity?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        setActivities(activities.filter((activity) => activity.id !== id));
        Toast.show({ type: "success", text1: "Activity Deleted Successfully!" });
      }},
    ]);
  };

  // Filter activities by pet and date
  const filteredActivities = activities.filter(
    (activity) => (selectedPet === "All" || activity.petName === selectedPet) && activity.date === selectedDate
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Log</Text>

      {/* Pet Selection Dropdown */}
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

      {/* Date Filter */}
      <Text style={styles.label}>Filter by Date:</Text>
      <DateTimePicker
        value={new Date(selectedDate)}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          setSelectedDate(selectedDate.toISOString().split("T")[0]);
        }}
      />

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search activities..."
        value={search}
        onChangeText={setSearch}
      />

      {/* List of Activities */}
      <FlatList
        data={filteredActivities.filter((activity) => activity.type.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.petName} - {item.type} - {item.duration}</Text>
            <Text>{item.time} | {item.date}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Add Activity Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Activity</Text>
      </TouchableOpacity>

      {/* Modal for Adding an Activity */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Activity</Text>

          {/* Pet Selection in Modal */}
          <Text style={styles.label}>Select Pet:</Text>
          <FlatList
            horizontal
            data={pets.filter((pet) => pet !== "All")} // Exclude "All" in selection
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.petOption, activityData.petName === item && styles.selectedOption]} 
                onPress={() => setActivityData({ ...activityData, petName: item })}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />

          <Text style={styles.label}>Activity Type:</Text>
          <TextInput style={styles.input} placeholder="Enter activity type (walk, play, etc.)" value={activityData.type} onChangeText={(text) => setActivityData({ ...activityData, type: text })} />

          <Text style={styles.label}>Duration:</Text>
          <TextInput style={styles.input} placeholder="Enter duration (minutes)" value={activityData.duration} onChangeText={(text) => setActivityData({ ...activityData, duration: text })} />

          <Text style={styles.label}>Time:</Text>
          <TextInput style={styles.input} placeholder="Enter time (HH:MM AM/PM)" value={activityData.time} onChangeText={(text) => setActivityData({ ...activityData, time: text })} />

          <Text style={styles.label}>Date:</Text>
          <DateTimePicker
            value={new Date(activityData.date)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setActivityData({ ...activityData, date: selectedDate.toISOString().split("T")[0] });
            }}
          />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddActivity}>
              <Text style={{ color: "white" }}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Toast />
    </View>
  );
}