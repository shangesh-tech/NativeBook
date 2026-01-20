import { View, Text, StyleSheet } from "react-native";
import { useAuthStore } from "../store/authStore";
import { Image } from "expo-image";
import { formatMemberSince } from "../lib/utils";

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  profileContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f0f0f0",
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  joinedDate: {
    fontSize: 13,
    color: "#999",
  },
});

export default function ProfileHeader() {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileContent}>
        <Image source={{ uri: user.profileImage }} style={styles.profileImage} />

        <View style={styles.userInfo}>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.joinedDate}>🗓️ Joined {user.createdAt ? formatMemberSince(user.createdAt) : "N/A"}</Text>
        </View>
      </View>
    </View>
  );
}