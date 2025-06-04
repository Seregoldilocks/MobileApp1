import React, { useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import Toast from "react-native-toast-message";
import FlipCard from "react-native-flip-card";

const pets = [
  {
    id: "1",
    name: "Buddy",
    species: "Dog",
    breed: "Golden Retriever",
    lastActivity: "Walked 30 mins",
    image: require("../assets/images/dog.png"),
  },
  {
    id: "2",
    name: "Whiskers",
    species: "Cat",
    breed: "Siamese",
    lastActivity: "Played with toy",
    image: require("../assets/images/cat.png"),
  },
];

const Dashboard = () => {
  const [vaccinationReminder, setVaccinationReminder] = useState("Next: Rabies Shot - June 10");

  const handleNavigation = (route) => {
    Toast.show({ type: "success", text1: "Redirecting...", text2: `Navigating to ${route}` });
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Banner */}
      <Animatable.View animation="fadeInUp" style={styles.banner}>
        <Text style={styles.bannerText}>Bringing you closer to your furry friends—because every wag matters!</Text>
      </Animatable.View>

      {/* Pet Profile Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🐾 Your Pets</Text>
        <FlatList
          horizontal
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleNavigation("../screens/PetManagementScreen")}>
              <FlipCard style={styles.petCard} flipHorizontal={true} flipVertical={false}>
                {/* Front Side */}
                <View style={styles.petCard}>
                  <Image source={item.image} style={styles.petImage} />
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text style={styles.petDetails}>{item.species} | {item.breed}</Text>
                </View>
                {/* Back Side */}
                <View style={styles.petCard}>
                  <Text style={styles.petName}>{item.name}</Text>
                  <Text style={styles.lastActivity}>Last Activity: {item.lastActivity}</Text>
                </View>
              </FlipCard>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation("../screens/FeedingLogScreen")}>
            <Ionicons name="restaurant" size={30} color="white" />
            <Text style={styles.actionText}>Log Meal</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation("../screens/ActivityLogScreen")}>
            <Ionicons name="footsteps" size={30} color="white" />
            <Text style={styles.actionText}>Log Activity</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigation("../screens/HealthRecordsScreen")}>
            <Ionicons name="medkit" size={30} color="white" />
            <Text style={styles.actionText}>Update Health</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vaccination Reminder */}
      <View style={styles.section}>
        <Link href="/VaccinationScreen" onPress={() => handleNavigation("Vaccination Reminder")} style={styles.sectionTitle}>
          💉 Vaccination Reminder
        </Link>
        <View style={styles.vaccineReminder}>
          <Ionicons name="alert-circle" size={24} color="white" />
          <Text style={styles.vaccineText}>{vaccinationReminder}</Text>
        </View>
      </View>

      {/* Recent Feeding & Activity Logs */}
      <View style={styles.section}>
        <Link href="/RecentLogs" onPress={() => handleNavigation("Recent Logs")} style={styles.sectionTitle}>
          🏃‍♂️ Recent Logs
        </Link>
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
  banner: { padding: 12, backgroundColor: "#81C784", marginBottom: 16, borderRadius: 10 },
  bannerText: { textAlign: "center", fontSize: 16, fontWeight: "bold", color: "white" },
  section: { padding: 10, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#333" },
  petCard: { padding: 10, backgroundColor: "white", marginRight: 10, alignItems: "center", borderRadius: 10 },
  petImage: { width: 80, height: 80, borderRadius: 40 },
  petName: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  petDetails: { fontSize: 14, color: "#555" },
  lastActivity: { fontSize: 12, color: "#888", marginTop: 5 },
  quickActions: { flexDirection: "row", justifyContent: "space-between" },
  actionButton: { padding: 12, backgroundColor: "#81C784", alignItems: "center", width: "30%", borderRadius: 10 },
  actionText: { color: "white", fontSize: 14, marginTop: 4, textAlign: "center" },
  vaccineReminder: { padding: 12, backgroundColor: "#E57373", flexDirection: "row", alignItems: "center", borderRadius: 10 },
  vaccineText: { color: "white", fontSize: 14, marginLeft: 10 },
  logContainer: { borderWidth: 2, borderColor: "#ccc", borderRadius: 10, padding: 10, backgroundColor: "#fff", marginVertical: 10 },
});

export default Dashboard;