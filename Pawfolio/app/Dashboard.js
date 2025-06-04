import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";
import FlipCard from "react-native-flip-card";

const pets = [
  {
    id: "1",
    name: "Buddy",
    type: "Dog",
    breed: "Golden Retriever",
    gender: "Male",
    birthday: "2019-06-15",
    weight: "30 kg",
    lastActivity: "Walked 30 mins",
    image: require("../assets/images/dog.png"),
  },
  {
    id: "2",
    name: "Whiskers",
    type: "Cat",
    breed: "Siamese",
    gender: "Female",
    birthday: "2020-08-10",
    weight: "5 kg",
    lastActivity: "Played with toy",
    image: require("../assets/images/cat.png"),
  },
];

const Dashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [vaccinationReminder, setVaccinationReminder] = useState(
    "Next: Rabies Shot - June 10"
  );

  useEffect(() => {
    if (route?.params?.fromLogin) {
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome back!",
        position: "top",
        visibilityTime: 3000,
      });
    }
  }, [route?.params]);

  const handleNavigation = (screen) => {
    Toast.show({
      type: "success",
      text1: "Redirecting...",
      text2: `Navigating to ${screen}`,
      visibilityTime: 1000,
    });
    navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Logo + Welcome Banner */}
      <Animatable.View animation="slideInDown" style={styles.header}>
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
        <View style={styles.bannerContainer}>
          <Text style={styles.bannerText}>
            Bringing you closer to your furry friends—because every wag matters!
          </Text>
        </View>
      </Animatable.View>

     {/* Pet Profile Cards */}
      <View style={styles.section}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => handleNavigation("PetManagement")}>
            <Text style={styles.sectionTitle}>🐾 Your Pets</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleNavigation("PetManagement")} style={styles.addButton}>
            <Ionicons name="add-circle-outline" size={24} color="#81C784" />
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <FlipCard style={styles.petCard} flipHorizontal flipVertical={false}>
              {/* Front */}
              <View style={styles.petCard}>
                <View style={styles.petImageContainer}>
                  <Image source={item.image} style={styles.petImage} />
                </View>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>{item.breed}</Text>
              </View>

              {/* Back */}
              <View style={styles.petCard}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petDetails}>Type: {item.type}</Text>
                <Text style={styles.petDetails}>Breed: {item.breed}</Text>
                <Text style={styles.petDetails}>Gender: {item.gender}</Text>
                <Text style={styles.petDetails}>Birthday: {item.birthday}</Text>
                <Text style={styles.petDetails}>Weight: {item.weight}</Text>
                <Text style={styles.lastActivity}>
                  Last Activity: {item.lastActivity}
                </Text>
              </View>
            </FlipCard>
          )}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNavigation("FeedingLog")}
          >
            <Ionicons name="restaurant" size={30} color="white" />
            <Text style={styles.actionText}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNavigation("ActivityLog")}
          >
            <Ionicons name="footsteps" size={30} color="white" />
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleNavigation("HealthRecords")}
          >
            <Ionicons name="medkit" size={30} color="white" />
            <Text style={styles.actionText}>Update Health</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vaccination Reminder */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => handleNavigation("HealthRecords")}>
          <Text style={styles.sectionTitle}>💉 Vaccination Reminder</Text>
        </TouchableOpacity>
        <View style={styles.vaccineReminder}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.vaccineText}>{vaccinationReminder}</Text>
        </View>
      </View>

      {/* Recent Logs */}
      <View style={styles.section}>
        <TouchableOpacity onPress={() => handleNavigation("ActivityLog")}>
          <Text style={styles.sectionTitle}>🏃‍♂️ Recent Logs</Text>
        </TouchableOpacity>
        <View style={styles.logContainer}>
          <Text style={styles.recentLog}>🍽 Last Meal: Chicken - 5:30 PM</Text>
          <Text style={styles.recentLog}>🐕 Last Walk: 2 km - 6:45 PM</Text>
        </View>
      </View>

      <Toast />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f8f9fa" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  logo: { width: 80, height: 80, borderRadius: 20, marginRight: 12 },
  bannerContainer: {
    backgroundColor: "#81C784",
    borderRadius: 10,
    padding: 8,
    flex: 1,
  },
  bannerText: { fontSize: 14, fontWeight: "bold", color: "white" },
  headerContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  addButton: { padding: 5 },
  section: { padding: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  petCard: {
    padding: 10,
    backgroundColor: "white",
    marginRight: 10,
    alignItems: "center",
    borderRadius: 10,
    width: 200,
  },
  petImageContainer: {
    backgroundColor: "#FFF176",
    borderRadius: 40,
    padding: 8,
    marginBottom: 8,
  },
  petImage: { width: 80, height: 80, borderRadius: 40 },
  petName: { fontSize: 16, fontWeight: "bold", marginTop: 5, marginBottom: 4 },
  petDetails: { fontSize: 14, color: "#555", marginBottom: 2, textAlign: "center" },
  lastActivity: { fontSize: 12, color: "#888", marginTop: 6, textAlign: "center" },
  quickActions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: {
    padding: 12,
    backgroundColor: "#81C784",
    alignItems: "center",
    width: "30%",
    borderRadius: 10,
  },
  actionText: { color: "white", fontSize: 14, marginTop: 4, textAlign: "center" },
  vaccineReminder: {
    padding: 12,
    backgroundColor: "#E57373",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
  },
  vaccineText: { color: "white", fontSize: 14, marginLeft: 10 },
  logContainer: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#fff",
    marginVertical: 10,
  },
  recentLog: { fontSize: 14, marginVertical: 2, color: "#444" },
});

export default Dashboard;
