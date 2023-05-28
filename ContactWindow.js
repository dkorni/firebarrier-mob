import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';

const contactsData = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    nickname: 'johndoe',
    avatar: require('./user.png'),
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Smith',
    nickname: 'janesmith',
    avatar: require('./user.png'),
  },
  // Add more contact data as needed
];

const ContactWindow = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(contactsData);

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredContacts = contactsData.filter((contact) =>
      contact.nickname.toLowerCase().includes(query.toLowerCase())
    );
    setContacts(filteredContacts);
  };

  const renderContactItem = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={item.avatar} style={styles.avatar} />
      <View style={styles.contactDetails}>
        <Text style={styles.name}>{`${item.firstName} ${item.lastName}`}</Text>
        <TouchableOpacity style={styles.callButton}>
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by nickname"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 10,
    backgroundColor: '#007AFF',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  contactDetails: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  callButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
};

export default ContactWindow;
