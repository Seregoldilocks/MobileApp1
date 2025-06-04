import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

export default function FeedingLogScreen() {
  const navigation = useNavigation();

  const [fontsLoaded] = useFonts({
    PoppinsRegular: require("../../assets/fonts/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf"),
  });

  const [pets, setPets] = useState([
    { id: "1", name: "Max" },
    { id: "2", name: "Bella" },
    { id: "3", name: "Charlie" },
  ]);

  const [meals, setMeals] = useState([]);
  const [search, setSearch] = useState("");
  const [filterPet, setFilterPet] = useState("");
  const [filterDate, setFilterDate] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [mealData, setMealData] = useState({
    petIds: [],
    foodType: "",
    quantityNumber: "",
    quantityUnit: "",
    date: new Date(),
    mealType: "Breakfast",
  });

  const mealTypes = [
    "Breakfast",
    "Lunch",
    "Snacks",
    "Dinner",
    "One Meal Only for a Day",
  ];

  const dateFilterOptions = [
    "All",
    "Today",
    "This Week",
    "This Month",
    "This Year",
  ];

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading fonts...</Text>
      </View>
    );
  }

  const handleAddMeal = () => {
    if (
      mealData.petIds.length === 0 ||
      !mealData.foodType ||
      !mealData.quantityNumber ||
      !mealData.quantityUnit ||
      !mealData.date ||
      !mealData.mealType
    ) {
      Toast.show({
        type: "error",
        text1: "Please fill all fields and select at least one pet.",
      });
      return;
    }
    const newMeal = {
      ...mealData,
      id: String(Date.now()),
    };
    setMeals([newMeal, ...meals]);
    setModalVisible(false);
    setMealData({
      petIds: [],
      foodType: "",
      quantityNumber: "",
      quantityUnit: "grams",
      date: new Date(),
      mealType: "Breakfast",
    });
    Toast.show({ type: "success", text1: "Meal added successfully!" });
  };

  const togglePetSelection = (id) => {
    setMealData((prev) => ({
      ...prev,
      petIds: prev.petIds.includes(id)
        ? prev.petIds.filter((pid) => pid !== id)
        : [...prev.petIds, id],
    }));
  };

  const toggleAllPets = () => {
    setMealData((prev) => ({
      ...prev,
      petIds: prev.petIds.length === pets.length ? [] : pets.map((p) => p.id),
    }));
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const filteredMeals = meals.filter((meal) => {
    if (filterPet && filterPet !== "all") {
      if (!meal.petIds.includes(filterPet)) return false;
    }
    const mealDate = new Date(meal.date);
    const today = new Date();
    switch (filterDate) {
      case "Today":
        if (mealDate.toDateString() !== today.toDateString()) return false;
        break;
      case "This Week": {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        if (mealDate < startOfWeek || mealDate > endOfWeek) return false;
        break;
      }
      case "This Month":
        if (
          mealDate.getMonth() !== today.getMonth() ||
          mealDate.getFullYear() !== today.getFullYear()
        )
          return false;
        break;
      case "This Year":
        if (mealDate.getFullYear() !== today.getFullYear()) return false;
        break;
    }
    if (
      search &&
      !meal.foodType.toLowerCase().includes(search.toLowerCase()) &&
      !meal.mealType.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const current = new Date(mealData.date);
      current.setFullYear(selectedDate.getFullYear());
      current.setMonth(selectedDate.getMonth());
      current.setDate(selectedDate.getDate());
      setMealData({ ...mealData, date: current });
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const current = new Date(mealData.date);
      current.setHours(selectedTime.getHours());
      current.setMinutes(selectedTime.getMinutes());
      setMealData({ ...mealData, date: current });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feeding Logs</Text>

      <View style={styles.filtersRow}>
        <View style={styles.filterWrapper}>
          <Picker
            selectedValue={filterPet}
            onValueChange={(val) => setFilterPet(val)}
            style={styles.filterPicker}
            dropdownIconColor="#666"
          >
            <Picker.Item label="All Pets" value="all" />
            {pets.map((pet) => (
              <Picker.Item key={pet.id} label={pet.name} value={pet.id} />
            ))}
          </Picker>
        </View>

        <View style={styles.filterWrapper}>
          <Picker
            selectedValue={filterDate}
            onValueChange={(val) => setFilterDate(val)}
            style={styles.filterPicker}
            dropdownIconColor="#666"
          >
            {dateFilterOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search meals..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredMeals}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={{ fontFamily: "PoppinsRegular", color: "#666" }}>
              No meals logged.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
            <Text style={styles.mealName}>
              {item.foodType} ({item.mealType})
            </Text>
            <Text style={styles.mealDetails}>
              Quantity: {item.quantityNumber} {item.quantityUnit}
            </Text>
            <Text style={styles.mealDetails}>
              Date: {formatDate(new Date(item.date))}
            </Text>
            <Text style={styles.mealDetails}>
              Time: {formatTime(new Date(item.date))}
            </Text>
            <Text style={styles.mealDetails}>
              Pets:{" "}
              {item.petIds.length === pets.length
                ? "All Pets"
                : item.petIds
                    .map((pid) => pets.find((p) => p.id === pid)?.name)
                    .filter(Boolean)
                    .join(", ")}
            </Text>
          </Animatable.View>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Meal</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Dashboard")}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>Add a New Meal</Text>

            <Text style={styles.label}>Select Pets:</Text>
            <View style={styles.petChecklistContainer}>
              <TouchableOpacity
                style={styles.petCheckboxContainer}
                onPress={toggleAllPets}
              >
                <View
                  style={[
                    styles.checkbox,
                    mealData.petIds.length === pets.length && styles.checkedBox,
                  ]}
                />
                <Text style={styles.checkboxLabel}>All Pets</Text>
              </TouchableOpacity>

              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCheckboxContainer}
                  onPress={() => togglePetSelection(pet.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      mealData.petIds.includes(pet.id) && styles.checkedBox,
                    ]}
                  />
                  <Text style={styles.checkboxLabel}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Type of Meal:</Text>
            <View style={[styles.input, { paddingHorizontal: 0, marginBottom: 10 }]}>
              <Picker
                selectedValue={mealData.mealType}
                onValueChange={(val) => setMealData({ ...mealData, mealType: val })}
                style={{ height: 50 }}
                dropdownIconColor="#666"
              >
                {mealTypes.map((type) => (
                  <Picker.Item key={type} label={type} value={type} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Food Type:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter food name/type (wet food, etc.)"
              placeholderTextColor="#666"
              value={mealData.foodType}
              onChangeText={(text) => setMealData({ ...mealData, foodType: text })}
            />

            <Text style={styles.label}>Quantity:</Text>
            <View style={styles.quantityContainer}>
              <TextInput
                style={[styles.input, { flex: 2, marginRight: 10 }]}
                placeholder="Enter quantity"
                placeholderTextColor="#666"
                value={mealData.quantityNumber}
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (/^\d*\.?\d*$/.test(text)) {
                    setMealData({ ...mealData, quantityNumber: text });
                  }
                }}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Unit"
                placeholderTextColor="#666"
                value={mealData.quantityUnit}
                onChangeText={(text) =>
                  setMealData({ ...mealData, quantityUnit: text })
                }
              />
            </View>

            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>
                {formatDate(mealData.date)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={mealData.date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity
              style={styles.input}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>
                {formatTime(mealData.date)}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={mealData.date}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddMeal}
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
  container: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontFamily: "PoppinsBold",
    fontSize: 24,
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  filterWrapper: {
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    overflow: "'",
    backgroundColor: "#fff",
  },
  filterPicker: {
    height: 50,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  searchIcon: {
    marginRight: 6,
  },
  searchBar: {
    flex: 1,
    height: 40,
    fontFamily: "PoppinsRegular",
    color: "#000",
    marginTop: 10
  },
  emptyList: {
    alignItems: "center",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#FFF",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  mealName: {
    fontFamily: "PoppinsBold",
    fontSize: 18,
    marginBottom: 6,
  },
  mealDetails: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#81C784",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: {
    fontFamily: "PoppinsBold",
    color: "#FFF",
    fontSize: 18,
  },
  backLink: {
    fontFamily: "PoppinsBold",
    color: "#007AFF",
    fontStyle: "bold",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f1f8e9",
    padding: 16,
  },
  modalTitle: {
    fontFamily: "PoppinsBold",
    fontSize: 22,
    marginBottom: 12,
    textAlign: "center",
  },
  label: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontFamily: "PoppinsRegular",
    fontSize: 16,
    marginBottom: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  petChecklistContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  petCheckboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 6,
    borderRadius: 4,
    backgroundColor: "#fff",
  },
  checkedBox: {
    backgroundColor: "#FF7F50",
    borderColor: "#FF7F50",
  },
  checkboxLabel: {
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#81C784",
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: "#FF7F50",
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: "PoppinsBold",
    fontSize: 16,
    color: "#fff",
  },
});
