import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import verification_icon from "@/assets/images/checkmark.png";
import verification_icon_gold from "@/assets/images/verification_icon_gold.png";
import { matchChars } from "@/lib/matchChars";
import { User } from '@/app/types/user';
import { truncateText } from '@/lib/truncateText';

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
        <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
        {item.verification && (
          <Image 
            source={item.verification_type === "gold" ? verification_icon_gold : verification_icon} 
            style={styles.verifiedIcon} 
          />
        )}
      </View>
       <Text style={styles.userBio} numberOfLines={2} ellipsizeMode="tail">{truncateText(item.bio, 100)}</Text>
    </View>
  </TouchableOpacity>
);

export default RenderUserItem;

const styles = StyleSheet.create({
  userItem: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E1E8ED',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
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
    flex: 1,
  },
  verifiedIcon: {
    width: 16,
    height: 16,
    marginLeft: 4,
  },
  userHandle: {
    fontSize: 14,
    color: '#657786',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#14171A',
  },
});