import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground } from "react-native";
import Card from "../../constants/card";
import { getusers, deleteUser, updateUserAccountStatus } from "../../services/api_authentication";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons, MaterialCommunityIcons, AntDesign } from "@expo/vector-icons";

function UsersList() {
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [expandedIndex, setExpandedIndex] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const userData = await getusers();
                setUsers(userData);
            } catch (error) {
                console.error("Error fetching users: ", error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (userId) => {
        try {
            await deleteUser(userId);
            const updateUsers = users.filter(user => user.id !== userId);
            setUsers(updateUsers);
            console.log("Usuario eliminado: ", userId);
        }catch(error){
            console.error("Error deleting user: ", error);
        }
    };

    const handleUpdate = (userId) => {
        navigation.navigate("UserData", { userId });
    };

    const handleIsActive = async (userId, isActive) => {
        try{
            const newIsActive = !isActive;
            await updateUserAccountStatus({ is_active: newIsActive }, userId);
            const updateUsers = users.map(user => {
                if(user.id === userId) {
                    return {...user, is_active: newIsActive};
                }
                return user;
            });
            setUsers(updateUsers);
        }catch(error){
            console.error("Error updating user status: ", error);
        }
    };

    const handleAddUser = () => {
        navigation.navigate('NewUserAdmin');
    };

    const handleAddCategory = () => {
        navigation.navigate('NewCategory');
    };

    const handleAddSubCategory = () =>{
        navigation.navigate('NewSubCategory');
    };

    const handleChatAdmin = () => {
        navigation.navigate('ChatAdmin');
    };

    const toggleExpand = (index) => {
        setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    };    

    const renderItem = ({ item, index }) => (
        <Card
            user={item}
            onDelete={() => handleDelete(item.id)}
            onUpdate={() => handleUpdate(item.id)}
            onActive={handleIsActive}
            onPress={() => toggleExpand(index)}
            expanded={expandedIndex === index}
        />
    );

    return (
        <ImageBackground source={require('../../pictures/fondo2.jpg')} style={styles.background}>
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                style={styles.flatList}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddUser}>
                <Feather name="plus" size={24} color="white"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryButton} onPress={handleAddCategory}>
                <MaterialIcons name="data-saver-on" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.subCategoryButton} onPress={handleAddSubCategory}>
                <MaterialCommunityIcons name="database-plus-outline" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.chatButton} onPress={handleChatAdmin}>
                <AntDesign name="wechat" size={24} color="white"/>
            </TouchableOpacity>
        </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 60
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    flatList: {
        marginTop: 25,
        width: "100%",
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: "blue",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryButton: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        backgroundColor: 'blue',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subCategoryButton: {
        position: 'absolute',
        bottom: 140,
        right: 20,
        backgroundColor: 'blue',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButton:{
        position: 'absolute',
        bottom: 200,
        right: 20,
        backgroundColor: 'blue',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UsersList;