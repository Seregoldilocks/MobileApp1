import { useState } from "react"
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
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { Picker } from "@react-native-picker/picker"
import { useNavigation } from "@react-navigation/native"
import * as Animatable from "react-native-animatable"

export default function HealthRecordsScreen() {
  const navigation = useNavigation()

  const [pets, setPets] = useState([
    { id: "1", name: "Max" },
    { id: "2", name: "Bella" },
    { id: "3", name: "Charlie" },
  ])

  const dateFilterOptions = ["All", "Today", "This Week", "This Month", "This Year"]
  const [filterPet, setFilterPet] = useState("all")
  const [filterDate, setFilterDate] = useState("All")
  const [search, setSearch] = useState("")

  const [records, setRecords] = useState([])
  const [modalVisible, setModalVisible] = useState(false)
  const [editingRecordId, setEditingRecordId] = useState(null)

  const [healthData, setHealthData] = useState({
    petIds: [],
    visitType: "",
    vetLoc: "",
    notes: "",
    date: new Date(),
  })

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)

  const togglePetSelection = (petId) => {
    setHealthData((prev) => ({
      ...prev,
      petIds: prev.petIds.includes(petId) ? prev.petIds.filter((id) => id !== petId) : [...prev.petIds, petId],
    }))
  }

  const toggleAllPets = () => {
    if (healthData.petIds.length === pets.length) {
      setHealthData((prev) => ({ ...prev, petIds: [] }))
    } else {
      setHealthData((prev) => ({ ...prev, petIds: pets.map((p) => p.id) }))
    }
  }

  const handleAddOrUpdateRecord = () => {
    if (!healthData.petIds.length || !healthData.visitType || !healthData.vetLoc || !healthData.date) {
      Toast.show({
        type: "error",
        text1: "Please fill all required fields.",
      })
      return
    }

    if (editingRecordId) {
      // Update existing record
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingRecordId
            ? {
                ...record,
                petId: healthData.petIds[0],
                visitType: healthData.visitType,
                vetLoc: healthData.vetLoc,
                notes: healthData.notes,
                date: healthData.date,
              }
            : record,
        ),
      )
      Toast.show({ type: "success", text1: "Health record updated!" })
    } else {
      // Create new records
      const newRecords = healthData.petIds.map((petId) => ({
        id: `${Date.now()}-${petId}`,
        petId,
        visitType: healthData.visitType,
        vetLoc: healthData.vetLoc,
        notes: healthData.notes,
        date: healthData.date,
      }))

      setRecords((prev) => [...newRecords, ...prev])
      Toast.show({ type: "success", text1: "Record(s) added successfully!" })
    }

    setHealthData({
      petIds: [],
      visitType: "",
      vetLoc: "",
      notes: "",
      date: new Date(),
    })
    setModalVisible(false)
    setEditingRecordId(null)
  }

  const handleEditRecord = (record) => {
    setEditingRecordId(record.id)
    setHealthData({
      petIds: [record.petId],
      visitType: record.visitType,
      vetLoc: record.vetLoc,
      notes: record.notes,
      date: new Date(record.date),
    })
    setModalVisible(true)
  }

  const handleDeleteRecord = (recordId) => {
    Alert.alert("Delete Health Record", "Are you sure you want to delete this record?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setRecords((prev) => prev.filter((record) => record.id !== recordId))
          Toast.show({ type: "success", text1: "Record deleted!" })
        },
        style: "destructive",
      },
    ])
  }

  const formatDate = (date) => date.toISOString().split("T")[0]
  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      const updated = new Date(healthData.date)
      updated.setFullYear(selectedDate.getFullYear())
      updated.setMonth(selectedDate.getMonth())
      updated.setDate(selectedDate.getDate())
      setHealthData({ ...healthData, date: updated })
    }
  }

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      const updated = new Date(healthData.date)
      updated.setHours(selectedTime.getHours())
      updated.setMinutes(selectedTime.getMinutes())
      setHealthData({ ...healthData, date: updated })
    }
  }

  const isWithinDateFilter = (date) => {
    const now = new Date()
    const target = new Date(date)

    switch (filterDate) {
      case "Today":
        return target.toDateString() === now.toDateString()
      case "This Week": {
        const start = new Date(now)
        start.setDate(now.getDate() - now.getDay())
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        return target >= start && target <= end
      }
      case "This Month":
        return target.getMonth() === now.getMonth() && target.getFullYear() === now.getFullYear()
      case "This Year":
        return target.getFullYear() === now.getFullYear()
      default:
        return true
    }
  }

  const filteredRecords = records.filter((rec) => {
    const matchSearch =
      !search ||
      rec.vetLoc.toLowerCase().includes(search.toLowerCase()) ||
      rec.visitType.toLowerCase().includes(search.toLowerCase())

    const matchPet = filterPet === "all" || rec.petId === filterPet
    const matchDate = isWithinDateFilter(rec.date)

    return matchSearch && matchPet && matchDate
  })

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Records</Text>

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

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by vet location or visit type..."
          placeholderTextColor="#666"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyList}>
            <Text style={{ fontFamily: "PoppinsRegular", color: "#666" }}>No health records available.</Text>
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            onLongPress={() => {
              Alert.alert("Edit or Delete", "", [
                { text: "Cancel", style: "cancel" },
                { text: "Edit", onPress: () => handleEditRecord(item) },
                { text: "Delete", style: "destructive", onPress: () => handleDeleteRecord(item.id) },
              ])
            }}
          >
            <Animatable.View animation="fadeInUp" duration={500} style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.recordName}>{item.visitType}</Text>
                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity onPress={() => handleEditRecord(item)}>
                    <Ionicons name="pencil" size={20} color="#4CAF50" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteRecord(item.id)}>
                    <Ionicons name="trash" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.recordDetails}>Vet Location: {item.vetLoc}</Text>
              <Text style={styles.recordDetails}>Date: {formatDate(new Date(item.date))}</Text>
              <Text style={styles.recordDetails}>Time: {formatTime(new Date(item.date))}</Text>
              <Text style={styles.recordDetails}>Pet: {pets.find((p) => p.id === item.petId)?.name || "Unknown"}</Text>
              {item.notes ? <Text style={styles.recordDetails}>Notes: {item.notes}</Text> : null}
            </Animatable.View>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+ Add Record</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backLink}>← Back to Home</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>{editingRecordId ? "Edit Health Record" : "Add Health Record"}</Text>

            <Text style={styles.label}>Select Pets:</Text>
            <View style={styles.petChecklistContainer}>
              <TouchableOpacity style={styles.petCheckboxContainer} onPress={toggleAllPets}>
                <View style={[styles.checkbox, healthData.petIds.length === pets.length && styles.checkedBox]} />
                <Text style={styles.checkboxLabel}>All Pets</Text>
              </TouchableOpacity>

              {pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  style={styles.petCheckboxContainer}
                  onPress={() => togglePetSelection(pet.id)}
                >
                  <View style={[styles.checkbox, healthData.petIds.includes(pet.id) && styles.checkedBox]} />
                  <Text style={styles.checkboxLabel}>{pet.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Visit Type:</Text>
            <TextInput
              style={styles.input}
              placeholder="Check-up, Vaccination..."
              placeholderTextColor="#666"
              value={healthData.visitType}
              onChangeText={(text) => setHealthData({ ...healthData, visitType: text })}
            />

            <Text style={styles.label}>Veterinarian Location/Clinic:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter vet's location or clinic name"
              placeholderTextColor="#666"
              value={healthData.vetLoc}
              onChangeText={(text) => setHealthData({ ...healthData, vetLoc: text })}
            />

            <Text style={styles.label}>Notes (optional):</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              placeholder="Any additional notes"
              placeholderTextColor="#666"
              value={healthData.notes}
              onChangeText={(text) => setHealthData({ ...healthData, notes: text })}
            />

            <Text style={styles.label}>Date:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>{formatDate(healthData.date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={healthData.date}
                mode="date"
                display="default"
                onChange={onChangeDate}
                maximumDate={new Date()}
              />
            )}

            <Text style={styles.label}>Time:</Text>
            <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
              <Text style={{ color: "#000", fontFamily: "PoppinsRegular" }}>{formatTime(healthData.date)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker value={healthData.date} mode="time" display="default" onChange={onChangeTime} />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false)
                  setEditingRecordId(null)
                  setHealthData({
                    petIds: [],
                    visitType: "",
                    vetLoc: "",
                    notes: "",
                    date: new Date(),
                  })
                }}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleAddOrUpdateRecord}>
                <Text style={styles.buttonText}>{editingRecordId ? "Update" : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Toast />
    </View>
  )
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
  recordName: { fontFamily: "PoppinsBold", fontSize: 18, marginBottom: 6 },
  recordDetails: { fontFamily: "PoppinsRegular", fontSize: 14, color: "#333" },
  addButton: {
    backgroundColor: "#81C784",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  addButtonText: { fontFamily: "PoppinsBold", color: "#FFF", fontSize: 18 },
  backLink: { fontFamily: "PoppinsBold", color: "#007AFF", fontSize: 16, textAlign: "center", marginBottom: 20 },
  modalContainer: { flex: 1, backgroundColor: "#f1f8e9", padding: 16 },
  modalTitle: { fontFamily: "PoppinsBold", fontSize: 22, marginBottom: 12, textAlign: "center" },
  label: { fontFamily: "PoppinsBold", fontSize: 16, marginBottom: 6 },
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
})
