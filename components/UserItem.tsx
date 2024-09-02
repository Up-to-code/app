import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import verification_icon from "@/assets/images/checkmark.png";
import verification_icon_gold from "@/assets/images/verification_icon_gold.png";
import { matchChars } from "@/lib/matchChars";
import { User } from '@/app/types/user';
 
 
const RenderUserItem: React.FC<{ item: User }> = ({ item }) => (
  <TouchableOpacity 
    style={styles.userItem}  
    onPress={() => {
      router.push(`/Friend/${item.id}`);
    }}
  >
    <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
    <View style={styles.userInfo}>
      <View style={styles.nameContainer}>
        <Text style={styles.userName}>{item.name}</Text>
        {item.verification && (
          <Image source={(
            item.verification_type === "gold" ? verification_icon_gold : verification_icon
          )} style={styles.verifiedIcon} />
        )}
      </View>
      <Text style={styles.userBio}>{matchChars(10, item.bio)}</Text>
    </View>
  </TouchableOpacity>
);
 
export default RenderUserItem;
const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#F5F8FA',
    borderRadius: 10,
    marginVertical: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userInfo: {
    justifyContent: 'center',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#14171A',
  },
  verifiedIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  userBio: {
    color: '#090b0d',
    marginTop: 5,
  },
});