import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Image } from 'react-native';
import Context from './Context';
import app from './app.json';
import FooterMenuBar from './components/FooterMenuBar'
import CallManager from './logic/CallManager';

let contactsData = null;

function atob(str) {
  return Buffer.from(str, 'base64').toString('binary');
}


const ContactWindow = ({navigation}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const [contacts, setContacts] = useState(contactsData);

  async function LoadData(){
    const url = app.WebApi+"/persons";
    await fetch(url,{
      method:'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': Context.TOKEN
      }
    })
    .then((response) => {
      console.log(Context.TOKEN)
      if(response.status == 200)
        return response.json()
      
      else
        throw new Error('Smth was wrong: '+response.status);
    })
    .then(async (responseJson) =>  {
      contactsData = responseJson;
      setContacts(responseJson);
      return responseJson;
    })
    .catch((error) => {
      console.error(error);
    });
  }
  
  if(contacts == null){
    LoadData();
  }
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredContacts = contactsData.filter((contact) =>
      contact.lastname.toLowerCase().includes(query.toLowerCase())
    );
    setContacts(filteredContacts);
  };

  const startCall= async (id, navigation)=>{
    let tokenData = JSON.parse(atob(Context.TOKEN.split('.')[1]));
    await CallManager.Call(id, tokenData.UserId, navigation);

  }

  const renderContactItem = ({ item }) => (
    <View style={styles.contactContainer}>
      <Image source={require('./user.png')} style={styles.avatar} />
      <View style={styles.contactDetails}>
        <Text style={styles.name}>{`${item.firstname} ${item.lastname}`}</Text>
        <TouchableOpacity style={styles.callButton} onPress={()=>startCall(item.id, navigation)}>
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
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={contacts}
        renderItem={renderContactItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <FooterMenuBar navigation={navigation} />
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
