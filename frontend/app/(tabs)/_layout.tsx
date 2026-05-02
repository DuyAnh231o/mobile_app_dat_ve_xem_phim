import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native';
import { useEffect, useMemo, useState } from "react";
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { StyleSheet } from "react-native";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
      headerStyle: {
      backgroundColor: "#4d4931",
    },
    tabBarActiveTintColor: "#E2B200",
    tabBarInactiveTintColor: "#A0A0A0",
    tabBarLabelStyle: {
      fontSize: 12,
      textAlign: "center",
      lineHeight: 16,
      marginTop: 2,
    },
    
    tabBarStyle: {
      height: 100,
      paddingTop: 6,
      paddingBottom: 6,
      backgroundColor: "#4d4931",
      borderTopColor: "#2B271C",
    },
    headerShown: useClientOnlyValue(false, true),
  }}
>

      <Tabs.Screen
        name="index"
        options={{
    title: "Lịch chiếu theo phim",
    headerTitle: () => <Text style={styles.logoText}>HDA Cinemas</Text>,
    headerStyle: {
      backgroundColor: "#4d4931",
      height: 110,
    },
    headerTitleStyle: {
      color: "#4d4931",
    },
    headerTitleContainerStyle: {
      paddingBottom: 12,
    },
    headerRightContainerStyle: {
      paddingRight: 10,
      paddingBottom: 12,
    },
    tabBarLabel: ({ color }) => (
      <Text style={[styles.tabLabel, { color }]}>
        {"Lịch chiếu\ntheo phim"}
      </Text>
    ),
    tabBarIcon: ({ color }) => <TabBarIcon name="film" color={color} />,
    headerRight: () => (
      <Link href="/login" asChild>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>
      </Link>
    ),
  }}
      />

             <Tabs.Screen
               name="lich_chieu_theo_rap"
                   options={{
                 title: "Lịch chiếu theo rạp",
                 headerTitle: () => <Text style={styles.headertitle}>Lịch chiếu theo rạp</Text>,
                  headerStyle: {
      backgroundColor: "#4d4931",
      height: 110,
    },
   
                  tabBarLabel: ({ color }) => (
                      <Text style={[styles.tabLabel, { color }]}>
                         {"Lịch chiếu\ntheo rạp"}
                               </Text>
                            ),
         tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color={color} />,
  }}
/>      


      <Tabs.Screen
        name="voucher"
        options={{
          title: "Voucher",
          headerTitle: () => <Text style={styles.voucherHeaderTitle}>VOUCHER CỦA TÔI</Text>,
          headerTitleAlign: "left",
          headerStyle: {
            
            backgroundColor: "#4d4931",
            height: 110,
          },
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>{"Voucher"}</Text>
          ),
          tabBarIcon: ({ color }) => <TabBarIcon name="ticket" color={color} />,
          headerRight: () => (
            <View style={styles.voucherHeaderButtons}>
              <Link href="/addvoucher" asChild>
                <TouchableOpacity style={styles.voucherIconButton}>
                  <FontAwesome name="plus" size={20} color="#E2B200" />
                </TouchableOpacity>
              </Link>
              <Link href="/voucher-history" asChild>
                <TouchableOpacity style={styles.voucherIconButton}>
                  <FontAwesome name="history" size={20} color="#E2B200" />
                </TouchableOpacity>
              </Link>
            </View>
          ),
        }}
        />
  
        <Tabs.Screen
  name="offers"
  options={{
    title: "Ưu đãi",
    headerTitle: () => <Text style={styles.headertitle}>Tin mới và Ưu đãi</Text>,
     headerStyle: {
      backgroundColor: "#4d4931",
      height: 110,
    },
  
    tabBarIcon: ({ color }) => <TabBarIcon name="gift" color={color} />,
  }}
/>
<Tabs.Screen
  name="more"
  options={{
    title: "Khác",
    headerTitle: () => <Text style={styles.headertitle}>Khác</Text>,
     headerStyle: {
      backgroundColor: "#4d4931",
      height: 110,
    },
    headerTitleStyle: {
      color: "#4d4931",
    },

    tabBarIcon: ({ color }) => <TabBarIcon name="ellipsis-h" color={color} />,
  }}
/>


    </Tabs>
  );
}
const styles = StyleSheet.create({
  loginText: {
    color: "#524300",
    fontSize: 16,
    fontWeight: "700",

  },
  tabLabel: {
  fontSize: 12,
  textAlign: "center",
  lineHeight: 16,
  width: 72,
},

  loginButton: {
      backgroundColor: "#E2B200",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
     marginRight: 10,
    minWidth: 118,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
  fontSize: 22,
  fontWeight: "800",
  color: "#E2B200",
   marginRight: 180,
},
  headertitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#E2B200",
     marginRight: 120,
  },
    voucherHeaderTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#E2B200",
    letterSpacing: 1,
  },
  voucherHeaderButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    gap: 12,
  },
  voucherIconButton: {
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
  },
});
