# HospitalProject

우리병원 프로젝트<br>
<br>
yarn 명령어로 전체 패키지 설치

안드로이드 사용 yarn android<br>
안드로이드 사용 yarn ios<br>

# node module 수정본

# react-native-gifted-chat ⇒ lib⇒ Bubble.js (gift-chat 채팅 말풍선 변경)

```JS
import PropTypes from "prop-types";
import React from "react";
import {
  Text,
  Clipboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Platform,
} from "react-native";
import QuickReplies from "./QuickReplies";
import MessageText from "./MessageText";
import MessageImage from "./MessageImage";
import MessageVideo from "./MessageVideo";
import MessageAudio from "./MessageAudio";
import Time from "./Time";
import Color from "./Color";
import { StylePropType, isSameUser, isSameDay } from "./utils";
import Font from "../../../src/common/Font"; //사용하는 폰트가 있다면

const styles = {
  left: StyleSheet.create({
    container: {
      flex: 1,
      marginRight: 100, // move from wrapper
      alignItems: "flex-start",
      marginBottom: 0,
    },

    wrapper: {
      borderRadius: 15,
      backgroundColor: "#f0f0f0",
      // marginRight: 60, remove
      marginRight: -3,
      minHeight: 20,
      justifyContent: "flex-end",
    },
    containerToNext: {
      borderBottomLeftRadius: 0,
    },
    containerToPrevious: {
      borderTopLeftRadius: 0,
    },
    positions: {
      marginLeft: 0,
    },
  }),

  right: StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "flex-end",
      marginLeft: 90, // move from wrapper
    },
    wrapper: {
      borderRadius: 15,
      backgroundColor: "#0084ff",
      marginLeft: -3, //remove
      minHeight: 20,
      justifyContent: "flex-end",
    },
    containerToNext: {
      borderBottomRightRadius: 0,
    },
    containerToPrevious: {
      borderTopRightRadius: 0,
    },
    positions: {
      marginRight: 0,
    },
  }),
  bottom: {
    // before:
    // flexDirection: 'row',
    // justifyContent: 'flex-end',
    alignItems: "flex-end",
  },
  tick: {
    fontSize: 10,
    backgroundColor: "transparent",
    color: "white",
  },
  tickView: {
    flexDirection: "row",
    marginRight: 10,
  },
};
const DEFAULT_OPTION_TITLES = ["Copy Text", "Cancel"];

export default class Bubble extends React.Component {
  constructor() {
    super(...arguments);
    this.onLongPress = () => {
      const { currentMessage } = this.props;
      if (this.props.onLongPress) {
        this.props.onLongPress(this.context, this.props.currentMessage);
      } else if (currentMessage && currentMessage.text) {
        const { optionTitles } = this.props;
        const options =
          optionTitles && optionTitles.length > 0
            ? optionTitles.slice(0, 2)
            : DEFAULT_OPTION_TITLES;
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                Clipboard.setString(currentMessage.text);
                break;
              default:
                break;
            }
          }
        );
      }
    };
  }
  styledBubbleToNext() {
    const { currentMessage, nextMessage, position, containerToNextStyle } =
      this.props;
    if (
      currentMessage &&
      nextMessage &&
      position &&
      isSameUser(currentMessage, nextMessage) &&
      isSameDay(currentMessage, nextMessage)
    ) {
      return [
        styles[position].containerToNext,
        containerToNextStyle && containerToNextStyle[position],
      ];
    }
    return null;
  }
  styledBubbleToPrevious() {
    const {
      currentMessage,
      previousMessage,
      position,
      containerToPreviousStyle,
    } = this.props;
    if (
      currentMessage &&
      previousMessage &&
      position &&
      isSameUser(currentMessage, previousMessage) &&
      isSameDay(currentMessage, previousMessage)
    ) {
      return [
        styles[position].containerToPrevious,
        containerToPreviousStyle && containerToPreviousStyle[position],
      ];
    }
    return null;
  }
  renderQuickReplies() {
    const {
      currentMessage,
      onQuickReply,
      nextMessage,
      renderQuickReplySend,
      quickReplyStyle,
    } = this.props;
    if (currentMessage && currentMessage.quickReplies) {
      const { containerStyle, wrapperStyle, ...quickReplyProps } = this.props;
      if (this.props.renderQuickReplies) {
        return this.props.renderQuickReplies(quickReplyProps);
      }
      return (
        <QuickReplies
          {...{
            currentMessage,
            onQuickReply,
            nextMessage,
            renderQuickReplySend,
            quickReplyStyle,
          }}
        />
      );
    }
    return null;
  }
  renderMessageText() {
    if (this.props.currentMessage && this.props.currentMessage.text) {
      const {
        containerStyle,
        wrapperStyle,
        optionTitles,
        ...messageTextProps
      } = this.props;
      if (this.props.renderMessageText) {
        return this.props.renderMessageText(messageTextProps);
      }
      return <MessageText {...messageTextProps} />;
    }
    return null;
  }
  renderMessageImage() {
    if (this.props.currentMessage && this.props.currentMessage.image) {
      const { containerStyle, wrapperStyle, ...messageImageProps } = this.props;
      if (this.props.renderMessageImage) {
        return this.props.renderMessageImage(messageImageProps);
      }
      return <MessageImage {...messageImageProps} />;
    }
    return null;
  }
  renderMessageVideo() {
    if (this.props.currentMessage && this.props.currentMessage.video) {
      const { containerStyle, wrapperStyle, ...messageVideoProps } = this.props;
      if (this.props.renderMessageVideo) {
        return this.props.renderMessageVideo(messageVideoProps);
      }
      return <MessageVideo {...messageVideoProps} />;
    }
    return null;
  }
  renderMessageAudio() {
    if (this.props.currentMessage && this.props.currentMessage.audio) {
      const { containerStyle, wrapperStyle, ...messageAudioProps } = this.props;
      if (this.props.renderMessageAudio) {
        return this.props.renderMessageAudio(messageAudioProps);
      }
      return <MessageAudio {...messageAudioProps} />;
    }
    return null;
  }
  renderTicks() {
    const { currentMessage, renderTicks, user } = this.props;
    if (renderTicks && currentMessage) {
      return renderTicks(currentMessage);
    }
    if (
      currentMessage &&
      user &&
      currentMessage.user &&
      currentMessage.user._id !== user._id
    ) {
      return null;
    }
    if (
      currentMessage &&
      (currentMessage.sent || currentMessage.received || currentMessage.pending)
    ) {
      return (
        <View style={styles.content.tickView}>
          {!!currentMessage.sent && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>
          )}
          {!!currentMessage.received && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>✓</Text>
          )}
          {!!currentMessage.pending && (
            <Text style={[styles.content.tick, this.props.tickStyle]}>🕓</Text>
          )}
        </View>
      );
    }
    return null;
  }
  renderTime() {
    if (this.props.currentMessage && this.props.currentMessage.createdAt) {
      const { containerStyle, wrapperStyle, textStyle, ...timeProps } =
        this.props;
      if (this.props.renderTime) {
        return this.props.renderTime(timeProps);
      }
      return <Time {...timeProps} />;
    }
    return null;
  }

  renderUsername() {
    const { currentMessage, user } = this.props;
    if (this.props.renderUsernameOnMessage && currentMessage) {
      if (user && currentMessage.user._id === user._id) {
        return null;
      }
      return (
        <View
          style={{
            width: "100%",
            marginBottom: Platform.OS === "ios" ? 0 : -10,
          }}
        >
          <Text style={{ fontSize: 12, fontFamily: Font.NotoSansLight }}>
            {currentMessage.user.name}
          </Text>
        </View>
      );
    }
    return null;
  }
  renderCustomView() {
    if (this.props.renderCustomView) {
      return this.props.renderCustomView(this.props);
    }
    return null;
  }
  renderBubbleContent() {
    return this.props.isCustomViewBottom ? (
      <View>
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
        {this.renderCustomView()}
      </View>
    ) : (
      <View>
        {this.renderCustomView()}
        {this.renderMessageImage()}
        {this.renderMessageVideo()}
        {this.renderMessageAudio()}
        {this.renderMessageText()}
      </View>
    );
  }
  render() {
    const { position, containerStyle, wrapperStyle, bottomContainerStyle } =
      this.props;
    let status = (
      <View
        style={[
          { alignItems: "flex-end" },
          styles[position].positions,
          bottomContainerStyle[position],
        ]}
      >
        {this.renderTime()}
        {this.renderTicks()}
      </View>
    );
    return (
      <View style={[styles[position].container, containerStyle[position]]}>
        {this.renderUsername()}
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
          }}
        >
          {position == "left" ? null : status}
          <View
            style={[
              styles[position].wrapper,
              this.styledBubbleToNext(),
              this.styledBubbleToPrevious(),
              wrapperStyle && wrapperStyle[position],
            ]}
          >
            <TouchableWithoutFeedback
              onLongPress={this.onLongPress}
              accessibilityTraits="text"
            >
              <View>
                {this.renderCustomView()}
                {this.renderMessageImage()}
                {this.renderMessageText()}
              </View>
            </TouchableWithoutFeedback>
          </View>
          {position == "right" ? null : status}
        </View>
      </View>
    );
  }
}
Bubble.contextTypes = {
  actionSheet: PropTypes.func,
};
Bubble.defaultProps = {
  touchableProps: {},
  onLongPress: null,
  renderMessageImage: null,
  renderMessageVideo: null,
  renderMessageAudio: null,
  renderMessageText: null,
  renderCustomView: null,
  renderUsername: null,
  renderTicks: null,
  renderTime: null,
  renderQuickReplies: null,
  onQuickReply: null,
  position: "left",
  optionTitles: DEFAULT_OPTION_TITLES,
  currentMessage: {
    text: null,
    createdAt: null,
    image: null,
  },
  nextMessage: {},
  previousMessage: {},
  containerStyle: {},
  wrapperStyle: {},
  bottomContainerStyle: {},
  tickStyle: {},
  usernameStyle: {},
  containerToNextStyle: {},
  containerToPreviousStyle: {},
};
Bubble.propTypes = {
  user: PropTypes.object.isRequired,
  touchableProps: PropTypes.object,
  onLongPress: PropTypes.func,
  renderMessageImage: PropTypes.func,
  renderMessageVideo: PropTypes.func,
  renderMessageAudio: PropTypes.func,
  renderMessageText: PropTypes.func,
  renderCustomView: PropTypes.func,
  isCustomViewBottom: PropTypes.bool,
  renderUsernameOnMessage: PropTypes.bool,
  renderUsername: PropTypes.func,
  renderTime: PropTypes.func,
  renderTicks: PropTypes.func,
  renderQuickReplies: PropTypes.func,
  onQuickReply: PropTypes.func,
  position: PropTypes.oneOf(["left", "right"]),
  optionTitles: PropTypes.arrayOf(PropTypes.string),
  currentMessage: PropTypes.object,
  nextMessage: PropTypes.object,
  previousMessage: PropTypes.object,
  containerStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  wrapperStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  bottomContainerStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  tickStyle: StylePropType,
  usernameStyle: StylePropType,
  containerToNextStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
  containerToPreviousStyle: PropTypes.shape({
    left: StylePropType,
    right: StylePropType,
  }),
};
```

# react-native-gifted-chat ⇒ lib ⇒ Day.js (gift-chat 날짜형식 변경 1)

```JS
    import PropTypes from 'prop-types';
    import React, { PureComponent } from 'react';
    import { Platform, StyleSheet, Text, View } from 'react-native';
    import dayjs from 'dayjs';
    import Color from './Color';
    import { StylePropType, isSameDay } from './utils';
    import { DATE_FORMAT } from './Constant';
    import moment from 'moment';
    import Font from '../../../src/common/Font'; //사용하는 폰트가 있다면
    import { black } from 'react-native-paper/lib/typescript/styles/colors';

    const styles = StyleSheet.create({
    container: {
        alignItems    : 'center',
        justifyContent: 'center',
        marginTop     : 20,
        marginBottom  : 15,
    },
    text: {
        backgroundColor : Color.backgroundTransparent,
        color           : Color.defaultColor,
        fontSize        : 10,
        fontFamily      : Font.NotoSansLight,
    },
    wrapper : {
        borderWidth     :0.3,
        borderColor     :'grey',
        paddingHorizontal:15,
        borderRadius    :50,
        paddingVertical : Platform.OS === 'ios' ? 5 : 0,
    }
    });
    //요일 계산
    const getTodayLabel = (data) => {
    var week = new Array('일', '월', '화', '수', '목', '금', '토');
    var today = new Date(data).getDay();
    var todayLabel = week[today];
    return todayLabel + '요일';
    };

    export default class Day extends PureComponent {
    render() {
        const {
        dateFormat,
        currentMessage,
        previousMessage,
        containerStyle,
        wrapperStyle,
        textStyle,
        } = this.props;
        const date = moment(currentMessage.createdAt); // Thursday Feb 2015
        const dow = date.day();
        if (currentMessage && !isSameDay(currentMessage, previousMessage)) {
        return (
            <View style={[styles.container, containerStyle]}>
            <View style={[styles.wrapper, wrapperStyle]}>
                <Text style={[styles.text, textStyle]}>
                {moment(currentMessage.createdAt).format('YYYY년 M월 D일 ')}
                {dow === 1
                    ? '월요일'
                    : dow === 2
                    ? '화요일'
                    : dow === 3
                    ? '수요일'
                    : dow === 4
                    ? '목요일'
                    : dow === 5
                    ? '금요일'
                    : dow === 6
                    ? '토요일'
                    : dow === 7 && '일요일'}
                {/* {dayjs(currentMessage.createdAt)
                    .locale(this.context.getLocale())
                    .format(dateFormat)} */}
                </Text>
            </View>
            </View>
        );
        }
        return null;
    }
    }
    Day.contextTypes = {
    getLocale: PropTypes.func,
    };
    Day.defaultProps = {
    currentMessage: {
        createdAt: null,
    },
    previousMessage: {},
    nextMessage: {},
    containerStyle: {},
    wrapperStyle: {},
    textStyle: {},
    dateFormat: DATE_FORMAT,
    };
    Day.propTypes = {
    currentMessage: PropTypes.object,
    previousMessage: PropTypes.object,
    nextMessage: PropTypes.object,
    inverted: PropTypes.bool,
    containerStyle: StylePropType,
    wrapperStyle: StylePropType,
    textStyle: StylePropType,
    dateFormat: PropTypes.string,
    };
    //# sourceMappingURL=Day.js.map

```
