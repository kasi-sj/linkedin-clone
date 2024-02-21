import { useState, useEffect } from "react";
import { Audio } from "expo-av";

const useSoundHook = () => {
  const [sound, setSound] = useState();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const connect = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./../assets/sound/linked_in_in_connet.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  };

  const post = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./../assets/sound/linked_in_post_success.mp3")
    );
    setSound(sound);

    await sound.playAsync();
  };

  return { connect , post};
};

export default useSoundHook;