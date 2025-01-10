import { View, Image, StyleSheet } from 'react-native'
import React, { useCallback, useContext, useState } from 'react'
import { Icon, IconButton, Menu, Text } from 'react-native-paper'
import { UserContext } from '../contexts/UserContext'
import { Logout } from '../services/UserService'
import { toTitleCase } from '../utils/toTitleCase'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const Navbar = () => {
    const { user } = useContext(UserContext)
    const [menuVisible, setMenuVisible] = useState(false)
    const { setUser } = useContext(UserContext);
    const openMenu = () => setMenuVisible(true)
    const closeMenu = () => setMenuVisible(false)

    const handleLogout = useCallback(async () => {
        try {
            await Logout();
            setUser(undefined);
        } catch (err: any) {
            console.log(err);
        }
    }, [setUser]);

    return (
        <View style={style.navContainer}>
            {/* Profile Picture or Username */}
            <View>
                {user?.dp ? (
                    <Image source={{ uri: user?.dp }} style={style.picture} />
                ) : (
                    <Text style={style.logotext}>
                        {toTitleCase(user?.username.slice(0, 8) || "")}
                    </Text>
                )}
            </View>

            {/* Icons Section */}
            <View style={style.iconView}>
                {/* Notification Icon */}
                <MaterialIcons
                    name="notifications"
                    size={35}
                    color="white"
                    onPress={() => console.log("Notification pressed")}
                />
                {1 > 0 && (
                    <View style={style.badge}>
                        <Text style={style.badgeText}>{1}</Text>
                    </View>
                )}

                {/* Menu Icon with Dropdown */}
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchorPosition='bottom'
                    anchor={
                        <MaterialIcons
                            name="menu"
                            size={35}
                            color="white"
                            onPress={openMenu}
                        />

                    }
                >
                    {/* <Menu.Item
                        onPress={() => router.push("/")} title="Home"
                    />
                    <Menu.Item
                        onPress={() => router.push("/explore")} title="Explore"
                    /> */}

                    <Menu.Item
                        title={<>
                            <MaterialIcons
                                name="logout"
                                size={35}
                                color="white"
                                onPress={handleLogout}
                            />
                        </>}
                    />
                </Menu>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    navContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 65,
        borderBottomWidth: 1,
        backgroundColor: 'red',
    },
    iconView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    picture: {
        marginLeft: 10,
        width: 40,
        height: 40,
        borderRadius: 50,
        borderColor: 'white',
        borderWidth: 2,
    },
    logotext: {
        color: 'white',
        fontSize: 20,
        paddingLeft: 10,
        fontWeight: 'bold',
    },
    badge: {
        position: 'absolute',
        top: 10,
        right: 13,
        backgroundColor: 'yellow',
        borderRadius: 10,
        minWidth: 15,
        minHeight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    badgeText: {
        color: 'black',
        fontSize: 10,
        fontWeight: 'bold',
    },
})

export default Navbar