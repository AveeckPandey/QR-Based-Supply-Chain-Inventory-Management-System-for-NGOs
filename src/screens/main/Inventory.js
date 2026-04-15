import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from '../../services/firebase';
import { collection, onSnapshot, doc, deleteDoc } from "firebase/firestore";
import { Card, IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

export default function Inventory({ navigation }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "inventory", id));
    } catch (err) {
      console.log("Error deleting item:", err);
    }
  };

  return (
    <View style={{ flex: 1 }}>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card style={{ margin: 8, padding: 16 }}>

            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
              {item.name}
            </Text>
            <Text>Qty: {item.quantity}</Text>
            <Text>{item.category}</Text>

            {/* QR CODE */}
            <View style={{ alignItems: 'center', marginVertical: 10 }}>
              <QRCode value={item.id} size={80} />
            </View>

            {/* ACTION BUTTONS */}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <IconButton
                icon="pencil"
                onPress={() => navigation.navigate("EditItem", { item })}
              />
              <IconButton
                icon="delete"
                onPress={() => handleDelete(item.id)}
              />
            </View>

          </Card>
        )}
      />

      {/* Floating Add Button */}
      <IconButton
        icon="plus"
        size={30}
        mode="contained"
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20
        }}
        onPress={() => navigation.navigate("AddItem")}
      />

    </View>
  );
}