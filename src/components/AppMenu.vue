<script setup>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/store/user";
import { useAppStore } from "@/store/app";

const userStore = useUserStore();
const appStore = useAppStore();
//When decompose sth from Pinia store storeToRefs need to be used. Its compounded.
const { userIsLoggedIn, session } = storeToRefs(userStore);
const { drawer } = storeToRefs(appStore);

const goToPage = (page) => {
    appStore.navigateToPage(page);
};

const menuItems = [
    {
        icon: "mdi-dumbbell",
        title: "Track",
        page: "/track",
    },
    {
        icon: "mdi-home",
        title: "Home",
        page: "/",
    },
    {
        icon: "mdi-chart-line",
        title: "Graph",
        page: "/graph",
    },
]


</script>

//If user is loggedIn then then logout button is shown else login button is shown.
<template>
    <v-navigation-drawer v-model="drawer" app>
        <v-list dense v-if="userIsLoggedIn">

            <v-list-item v-for="item in menuItems" :key="item.title" @click="goToPage(item.page)">
                <template v-slot:prepend>
                    <v-icon :icon="item.icon"></v-icon>
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>


            <v-list-item @click="userStore.logout()">
                <template v-slot:prepend>
                    <v-icon icon="mdi-account-arrow-right"></v-icon>
                </template>
                <v-list-item-title>Log out</v-list-item-title>
            </v-list-item>
        </v-list>

        <v-list dense v-else>
            <v-list-item @click="goToPage('/login')">

                <template v-slot:prepend>
                    <v-icon icon="mdi-account"></v-icon>
                </template>
                <v-list-item-title>Login</v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>