import React, { useState } from "react";
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
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import * as Animatable from "react-native-animatable";

export default function ActivityLogsScreen() {
  const navigation = useNavigation();

  const [pets] = useState([
    { id: "1", name: "Max" },
    { id: "2", name: "Bella" },
    { id: "3", name: "Charlie" },
  ]);

  const dateFilterOptions = ["All", "Today", "This Week", "This Month", "This Year"];
  const [filterPet, setFilterPet] = useState("all");
  const [filterDate, setFilterDate] = useState("All");
  const [search, setSearch] = useState("");
  const [logs, setLogs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLogId, setEditingLogId] = useState(null);

  const [activityData, setActivityData] = useState({
    petIds: [],
    type: "",
    duration: "",
    notes: "",
    date: new Date(),
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const togglePetSelection = (petId) => {
    setActivityData((prev) => ({
      ...prev,
      petIds: prev.petIds.includes(petId)
        ? prev.petIds.filter((id) => id !== petId)
        : [...prev.petIds, petId],
    }));
  };

  const toggleAllPets = () => {
    if (activityData.petIds.length === pets.length) {
      setActivityData((prev) => ({ ...prev, petIds: [] }));
    } else {
      setActivityData((prev) => ({ ...prev, petIds: pets.map((p) => p.id) }));
    }
  };

  const handleAddOrUpdateLog = () => {
    if (!activityData.petIds.length || !activityData.type || !activityData.duration) {
      Toast.show({ type: "error", text1: "Please fill all required fields." });
      return;
    }

    if (editingLogId) {
      // Update
      setLogs((prev) =>
        prev.map((log) =>
          log.id === editingLogId
            ? {
                ...log,
                petId: activityData.petIds[0],
                type: activityData.type,
                duration: activityData.duration,
                notes: activityData.notes,
                date: activityData.date,
              }
            : log
        )
      );
      Toast.show({ type: "success", text1: "Activity log updated!" });
    } else {
      // Create
      const newLogs = activityData.petIds.map((petId) => ({
        id: `${Date.now()}-${petId}`,
        petId,
        type: activityData.type,
        duration: activityData.duration,
        notes: activityData.notes,
        date: activityData.date,
      }));
      setLogs((prev) => [...newLogs, ...prev]);
      Toast.show({ type: "success", text1: "Activity log(s) added!" });
    }

    setActivityData({
      petIds: [],
      type: "",
      duration: "",
      notes: "",
      date: new Date(),
    });
    setModalVisible(false);
    setEditingLogId(null);
  };

  const handleEditLog = (log) => {
    setEditingLogId(log.id);
    setActivityData({
      petIds: [log.petId],
      type: log.type,
      duration: log.duration,
      notes: log.notes,
      date: new Date(log.date),
    });
    setModalVisible(true);
  };

  const handleDeleteLog = (logId) => {
    Alert.alert("Delete Activity", "Are you sure you want to delete this log?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setLogs((prev) => prev.filter((log) => log.id !== logId));
          Toast.show({ type: "success", text1: "Log deleted!" });
        },
        style: "destructive",
      },
    ]);
  };

  const formatDate = (date) => date.toISOString().split("T")[0];
  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const onChangeDate = (_, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const updated = new Date(activityData.date);
      updated.setFullYear(selectedDate.getFullYear());
      updated.setMonth(selectedDate.getMonth());
      updated.setDate(selectedDate.getDate());
      setActivityData({ ...activityData, date: updated });
    }
  };

  const onChangeTime = (_, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const updated = new Date(activityData.date);
      updated.setHours(selectedTime.getHours());
      updated.setMinutes(selectedTime.getMinutes());
      setActivityData({ ...activityData, date: updated });
    }
  };

  const isWithinDateFilter = (date) => {
    const now = new Date();
    const target = new Date(date);
    switch (filterDate) {
      case "Today":
        return target.toDateString() === now.toDateString();
      case "This Week": {
        const start = new Date(now);
        start.setDate(now.getDate() - now.getDay());
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return target >= start && target <= end;
      }
      case "This Month":
        return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear();
      case "This Year":
        return target.getFullYear() === now.getFullYear();
      default:
        return true;
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchSearch =
      !search ||
      log.type.toLowerCase().includes(search.toLowerCase()) ||
      log.notes.toLowerCase().includes(search.toLowerCase());

    const matchPet = filterPet === "all" || log.petId === filterPet;
    const matchDate = isWithinDateFilter(log.date);

    return matchSearch && matchPet && matchDate;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Logs</Text>

      {/* Filters */}
      <View style={styles.filtersRow}>
        <View style={styles.filterWrapper}>
          <Picker
            selectedValue={filterPet}
            onValueChange={setFilterPet}
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
            onValueChange={setFilterDate}
            style={styles.filterPicker}
            dropdownIconColor="#666"
          >
            {dateFilterOptions.map((option) => (
              <Picker.Item key={option} label={option} value={option} />
            ))}
          </Picker>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search activity or notes..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredLogs}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={{ fontFamily: "PoppinsRegular", color: "#666" }}>
              No activity logs available.
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              Alert.alert("Edit or Delete", "", [
                { text: "Cancel", style: "cancel" },
                { text: "Edit", onPress: () => handleEditLog(item) },
                { text: "Delete", style: "destructive", onPress: () => handleDeleteLog(item.id) },
              ]);
            }}
          >
            <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.activityType}>{item.type}</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity onPress={() => handleEditLog(item)}>
                    <Ionicons name="pencil" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteLog(item.id)}>
                    <Ionicons name="trash" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.activityDetails}>Duration: {item.duration}</Text>
              <Text style={styles.activityDetails}>Date: {formatDate(item.date)}</Text>
              <Text style={styles.activityDetails}>Time: {formatTime(item.date)}</Text>
              <Text style={styles.activityDetails}>
                Pet: {pets.find((p) => p.id === item.petId)?.name || "Unknown"}
              </Text>
              {item.notes ? <Text style={styles.activityDetails}>Notes: {item.notes}</Text> : null}
            </Animatable.View>
          </TouchableOpacity>
        )}
      />

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Activity</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalContainer}
        >
          <ScrollView>
            <Text style={styles.modalTitle}>
              {editingLogId ? "Edit Activity Log" : "Add Activity Log"}
            </Text>

            {/* Pet Selection */}
            <Text style={styles.label}>Select Pets:</Text>
            <View style={styles.petChecklistContainer}>
              <TouchableOpacity style={styles.petCheckboxContainer} onPress={toggleAllPets}>
                <View
                  style={[
                    styles.checkbox,
                    activityData.petIds.length === pets.length && styles.checkedBox,
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
                      activityData.petIds.includes(pet.id) && styles.checkedBox,
                    ]}
                  />
                  <Text style={styles.checkboxLabel}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Activity Type:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Walk, Play"
              placeholderTextColor="#666"
              value={activityData.type}
              onChangeText={(text) => setActivityData({ ...activityData, type: text })}
            />

            <Text style={styles.label}>Duration:</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 30 mins"
              placeholderTextColor="#666"
              value={activityData.duration}
              onChangeText={(text) => setActivityData({ ...activityData, duration: text })}
            />

            <Text style={styles.label}>Notes (optional):</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              placeholder="Any additional notes"
              placeholderTextColor="#666"
              value={activityData.notes}
              onChangeText={(text) => setActivityData({ ...activityData, notes: text })}
            />

            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>
                {formatDate(activityData.date)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={activityData.date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>
                {formatTime(activityData.date)}
              </Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={activityData.date}
                mode="time"
                display="default"
                onChange={onChangeTime}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEditingLogId(null);
                  setActivityData({
                    petIds: [],
                    type: "",
                    duration: "",
                    notes: "",
                    date: new Date(),
                  });
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddOrUpdateLog}
              >
                <Text style={styles.buttonText}>{editingLogId ? "Update" : "Save"}</Text>
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
  container: { flex: 1, backgroundColor: "#f1f8e9", paddingHorizontal: 16, paddingTop: 24 },
  title: { fontFamily: "PoppinsBold", fontSize: 24, marginBottom: 12 },
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
  searchIcon: { marginRight: 6 },
  searchBar: { flex: 1, height: 40, fontFamily: "PoppinsRegular", color: "#000", marginTop: 10 },
  filtersRow: { flexDirection: "row", marginBottom: 12 },
  filterWrapper: { flex: 1, marginHorizontal: 4, backgroundColor: "#fff", borderRadius: 8 },
  filterPicker: { height: 50, width: "100%" },
  emptyList: { alignItems: "center", marginTop: 20 },
  card: {
    backgroundColor: "#FFF", padding: 14, borderRadius: 10, marginBottom: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1,
    shadowRadius: 3, elevation: 2,
  },
  activityType: { fontFamily: "PoppinsBold", fontSize: 18, marginBottom: 6 },
  activityDetails: { fontFamily: "PoppinsRegular", fontSize: 14, color: "#333" },
  addButton: { backgroundColor: "#81C784", paddingVertical: 12, borderRadius: 8, alignItems: "center", marginBottom: 12 },
  addButtonText: { fontFamily: "PoppinsBold", color: "#FFF", fontSize: 18 },
  backLink: { fontFamily: "PoppinsBold", color: "#007AFF", fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalContainer: { flex: 1, backgroundColor: "#f1f8e9", padding: 16 },
  modalTitle: { fontFamily: "PoppinsBold", fontSize: 22, marginBottom: 12, textAlign: "center" },
  label: { fontFamily: "PoppinsBold", fontSize: 16, marginBottom: 6 },
  input: {
    backgroundColor: "#fff", borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    paddingHorizontal: 12, paddingVertical: Platform.OS === "ios" ? 12 : 8,
    fontFamily: "PoppinsRegular", fontSize: 16, marginBottom: 16,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  button: { flex: 1, paddingVertical: 14, borderRadius: 8, alignItems: "center" },
  cancelButton: { backgroundColor: "#81C784", marginRight: 10 },
  saveButton: { backgroundColor: "#FF7F50", marginLeft: 10 },
  buttonText: { fontFamily: "PoppinsBold", fontSize: 16, color: "#fff" },
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
    marginTop: 3,
    fontFamily: "PoppinsRegular",
    fontSize: 14,
  },
});

