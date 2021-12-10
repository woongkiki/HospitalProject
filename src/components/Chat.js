import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import {
  Avatar,
  Bubble,
  SystemMessage,
  Message,
  MessageText,
  BubbleProps,
  Time,
  Day,
} from 'react-native-gifted-chat';
import Font from '../common/Font';
import moment from 'moment';

export const renderAvatar = (props) => (
  <Image
    style={{ width: 40, borderRadius: 100, height: 40 }}
    source={{ uri: `${'android-chrome-256x256_w.png'}` }}
  />
  // <Avatar
  //   {...props}
  //   containerStyle={{ left: { borderRadius: 0 }, right: {} }}
  //   imageStyle={{ left: { borderRadius: 0}, right: {} }}
  // />
);

export const renderBubble = (props) => (
  <View
    style={{
      // Try to align it better with the avatar on Android.
      flexDirection: 'row',
      alignItems: 'baseline',
    }}
  >
    <Bubble
      {...props}
      style={{ flexDirection: 'row' }}
      containerStyle={{
        left: { backgroundColor: 'transparent' },
        right: { backgroundColor: 'transparent' },
      }}
      wrapperStyle={{

        left: {
          backgroundColor: '#F4F4F4',
          borderRadius: 15,
          marginTop: 5,
          minHeight: 20,
        },
        right: {
          backgroundColor: '#696968',
          borderRadius: 15,
          marginTop: 5,
        },

      }}

    />
  </View>
);

export const renderMessage = (props) => (
  <Message
    {...props}
    // renderDay={() => <Text>Date</Text>}
    containerStyle={{
      left: { backgroundColor: '#ffffff' },
      right: { backgroundColor: '#ffffff' },
    }}
  />
);

export const renderMessageText = (props) => (
  <MessageText
    {...props}
    containerStyle={{
      left: {
        backgroundColor: '#F4F4F4',
        color: '#111111',
        borderRadius: 5,
        padding: 3,
      },
      right: {
        backgroundColor: '#FFFEBC',
        color: '#111111',
        borderRadius: 5,
        padding: 3,
      },
    }}

    customTextStyle={{}}
  />
);
export const ChatTime = ({ currentMessage, timeFormat }) => {
  return (
    <Time
      currentMessage={currentMessage}
      timeFormat={timeFormat}
      containerStyle={{
        left: {
          justifyContent: 'flex-end',
          flexDirection: 'row',
        },
        right: {
          justifyContent: 'flex-end',
          flexDirection: 'row',
        },
      }}
      timeTextStyle={{
        right: {
          fontSize: 10,
          color: '#333333',
          textAlign: 'right',
          fontFamily: Font.NotoSansLight,
          lineHeight: 13,
        },
        left: {
          fontSize: 10,
          color: '#333333',
          textAlign: 'right',
          fontFamily: Font.NotoSansLight,
          lineHeight: 13,
        },
      }}
    />
  );
};

export const renderDay = (props) => {
  return <Day {...props} textStyle={{ color: '#333333' }} />;
};