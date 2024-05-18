/*
I want to have access and the ability to update the status of the user at all times, so i’ll set up
a user store in Pinia that will keep track of the current state and provide actions on updating the state
and logging in and out.
*/

import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useSupabaseClient } from "@/composables/supabase";
import router from "@/router";

export const useUserStore = defineStore("user", () => {
  //state
  const session = ref(null);

  //get data from countries
  const countries = async () => {
    const { data, error } = await useSupabaseClient.from("countries").select();

    console.log(data, error);
  };

  //Login with OTP - One Time Password relivered on users email
  const login = async (email, callback) => {
    const { error } = await useSupabaseClient.auth.signInWithOtp({ email });
    if (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
    if (typeof callback === "function") callback();
  };

  //Login with test account
  const TEST_login = async (email, password, callback) => {
    console.log("test");
    const { error } = await useSupabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
    if (typeof callback === "function") callback();
  };

  const logout = async (callback) => {
    const { error } = await useSupabaseClient.auth.signOut();
    if (error) {
      console.error("Logout error:", error);
      throw new Error("Login failed");
    }

    //When logging out is ok then redirect to /login
    router.push("/login");
    if (typeof callback === "function") callback();
  };

  //Insert a new record or update an existing record in the 'profiles' table. based on session
  const insertProfile = async (session) => {
    try {
      const { error } = await useSupabaseClient
        .from("profiles")
        .upsert({
          id: session.user.id,
          email_address: session.user.email,
          updated_at: new Date(),
        })
        .select();

      if (error) throw error;
    } catch (error) {
      console.error(error.message);
      return error;
    }
  };

  //Setting user session
  const setUserSession = (data) => {
    session.value = data;
  };

  //getter
  //Checking if user is still loggedIn by checking the session
  const userIsLoggedIn = computed(() => {
    if (session.value?.expires_at) {
      const expiresAt = new Date(0).setUTCSeconds(session.value.expires_at);
      const now = new Date().getSeconds();
      return now < expiresAt;
    }
    return false;
  });

  return {
    session,
    login,
    logout,
    setUserSession,
    userIsLoggedIn,
    countries,
    insertProfile,
    TEST_login,
  };
});
