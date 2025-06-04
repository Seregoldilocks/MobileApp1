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
} from "react-native";
import Toast from "react-native-toast-message";

export default function FeedingLogScreen() {
  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [mealData, setMealData] = useState({
    foodType: "",
    quantity: "",
    time: "",
  });

  const handleAddMeal = () => {
    if (!mealData.foodType || !mealData.quantity || !mealData.time) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    setMeals([...meals, { ...mealData, id: String(Date.now()) }]);
    setModalVisible(false);
    setMealData({ foodType: "", quantity: "", time: "" });
    Toast.show({ type: "success", text1: "Meal Added Successfully!" });
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => {
        setMeals(meals.filter((meal) => meal.id !== id));
        Toast.show({ type: "success", text1: "Meal Deleted Successfully!" });
      }},
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feeding Log</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search meals..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={meals.filter((meal) => meal.foodType.toLowerCase().includes(search.toLowerCase()))}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>{item.foodType} - {item.quantity}</Text>
            <Text>{item.time}</Text>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
              <Text style={{ color: "white" }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={{ color: "white", fontSize: 18 }}>+ Add Meal</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add a New Meal</Text>

          <Text style={styles.label}>Food Type:</Text>
          <TextInput style={styles.input} placeholder="Enter food type" value={mealData.foodType} onChangeText={(text) => setMealData({ ...mealData, foodType: text })} />

          <Text style={styles.label}>Quantity:</Text>
          <TextInput style={styles.input} placeholder="Enter quantity" value={mealData.quantity} onChangeText={(text) => setMealData({ ...mealData, quantity: text })} />

          <Text style={styles.label}>Time:</Text>
          <TextInput style={styles.input} placeholder="Enter time (HH:MM AM/PM)" value={mealData.time} onChangeText={(text) => setMealData({ ...mealData, time: text })} />

          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
              <Text style={{ color: "white" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleAddMeal}>
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
  
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  cancelButton: { backgroundColor: "gray", padding: 10, borderRadius: 10 },
  saveButton: { backgroundColor: "green", padding: 10, borderRadius: 10 },
});