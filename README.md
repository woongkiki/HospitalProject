# 대표의사 프로젝트

yarn 명령어로 전체 패키지 설치<br>
설치 후 ios의 경우 cd ios && pod install<br>

안드로이드 시뮬레이터 실행 yarn android<br>
ios 시뮬레이터 실행 yarn ios<br>


# node module 수정본

gift-chat 커스텀 부분이 node 모듈을 새로 다운할 때 마다 원래 코드로 초기화 됨으로<br>
아래 경로에 다음 코드를 입력

# react-native-gifted-chat ⇒ lib⇒ Bubble.js

# (gift-chat 채팅 말풍선 변경)

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

# react-native-gifted-chat ⇒ lib ⇒ Day.js

# (gift-chat 날짜형식 변경)

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

```

# react-native-gifted-chat ⇒ lib⇒ MessageText.js

# gift-chat 메시지 텍스트 부분 커스텀

```JS
    import PropTypes from 'prop-types';
    import React from 'react';
    import { Linking, StyleSheet, View, } from 'react-native';
    // @ts-ignore
    import ParsedText from 'react-native-parsed-text';
    import Communications from 'react-native-communications';
    import { StylePropType } from './utils';
    import Font from '../../../src/common/Font'; //사용하는 폰트가 있다면

    const WWW_URL_PATTERN = /^www\./i;

    const textStyle = {
        fontSize: 14,
        fontFamily:Font.NotoSansLight,
        lineHeight: 17,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 8,
        marginRight: 8,
    };

    const styles = {
        left: StyleSheet.create({
            container: {},
            text: {
                color: 'black',
                ...textStyle,
            },
            link: {
                color: 'black',
                textDecorationLine: 'underline',
            },
        }),
        right: StyleSheet.create({
            container: {},
            text: {
                color: '#fff',
                ...textStyle,
            },
            link: {
                color: 'black',
                textDecorationLine: 'underline',
            },
        }),
    };
    const DEFAULT_OPTION_TITLES = ['Call', 'Text', 'Cancel'];
    export default class MessageText extends React.Component {
        constructor() {
            super(...arguments);
            this.onUrlPress = (url) => {
                // When someone sends a message that includes a website address beginning with "www." (omitting the scheme),
                // react-native-parsed-text recognizes it as a valid url, but Linking fails to open due to the missing scheme.
                if (WWW_URL_PATTERN.test(url)) {
                    this.onUrlPress(`http://${url}`);
                }
                else {
                    Linking.canOpenURL(url).then(supported => {
                        if (!supported) {
                            console.error('No handler for URL:', url);
                        }
                        else {
                            Linking.openURL(url);
                        }
                    });
                }
            };
            this.onPhonePress = (phone) => {
                const { optionTitles } = this.props;
                const options = optionTitles && optionTitles.length > 0
                    ? optionTitles.slice(0, 3)
                    : DEFAULT_OPTION_TITLES;
                const cancelButtonIndex = options.length - 1;
                this.context.actionSheet().showActionSheetWithOptions({
                    options,
                    cancelButtonIndex,
                }, (buttonIndex) => {
                    switch (buttonIndex) {
                        case 0:
                            Communications.phonecall(phone, true);
                            break;
                        case 1:
                            Communications.text(phone);
                            break;
                        default:
                            break;
                    }
                });
            };
            this.onEmailPress = (email) => Communications.email([email], null, null, null, null);
        }
        shouldComponentUpdate(nextProps) {
            return (!!this.props.currentMessage &&
                !!nextProps.currentMessage &&
                this.props.currentMessage.text !== nextProps.currentMessage.text);
        }
        render() {
            const linkStyle = [
                styles[this.props.position].link,
                this.props.linkStyle && this.props.linkStyle[this.props.position],
            ];
            return (<View style={[
                styles[this.props.position].container,
                this.props.containerStyle &&
                    this.props.containerStyle[this.props.position],
            ]}>
            <ParsedText style={[
                styles[this.props.position].text,
                this.props.textStyle && this.props.textStyle[this.props.position],
                this.props.customTextStyle,
            ]} parse={[
                ...this.props.parsePatterns(linkStyle),
                { type: 'url', style: linkStyle, onPress: this.onUrlPress },
                { type: 'phone', style: linkStyle, onPress: this.onPhonePress },
                { type: 'email', style: linkStyle, onPress: this.onEmailPress },
            ]} childrenProps={{ ...this.props.textProps }}>
            {this.props.currentMessage.text}
            </ParsedText>
        </View>);
        }
    }
    MessageText.contextTypes = {
        actionSheet: PropTypes.func,
    };
    MessageText.defaultProps = {
        position: 'left',
        optionTitles: DEFAULT_OPTION_TITLES,
        currentMessage: {
            text: '',
        },
        containerStyle: {},
        textStyle: {},
        linkStyle: {},
        customTextStyle: {},
        textProps: {},
        parsePatterns: () => [],
    };
    MessageText.propTypes = {
        position: PropTypes.oneOf(['left', 'right']),
        optionTitles: PropTypes.arrayOf(PropTypes.string),
        currentMessage: PropTypes.object,
        containerStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        textStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        linkStyle: PropTypes.shape({
            left: StylePropType,
            right: StylePropType,
        }),
        parsePatterns: PropTypes.func,
        textProps: PropTypes.object,
        customTextStyle: StylePropType,
    };
    //# sourceMappingURL=MessageText.js.map

```

# react-native-gifted-chat ⇒ lib ⇒ Composer.js

# gift-chat 채팅 입력 input 커스텀

```JS
    import PropTypes from 'prop-types';
    import React from 'react';
    import { Platform, StyleSheet, TextInput } from 'react-native';
    import { MIN_COMPOSER_HEIGHT, DEFAULT_PLACEHOLDER } from './Constant';
    import Color from './Color';
    import { StylePropType } from './utils';
    const styles = StyleSheet.create({
        textInput: {
            flex: 1,
            marginLeft: 10,
            fontSize: 16,
            lineHeight: 16,
            ...Platform.select({
                web: {
                    paddingTop: 6,
                    paddingLeft: 4,
                },
            }),
            marginTop: Platform.select({
                ios: 6,
                android: 0,
                web: 6,
            }),
            marginBottom: Platform.select({
                ios: 5,
                android: 3,
                web: 4,
            }),
            color:'#333' // 사용자 디바이스가 블랙테마인 경우 input입력시 글씨가 흰색으로 설정됨을 변경
        },
    });
    export default class Composer extends React.Component {
        constructor() {
            super(...arguments);
            this.contentSize = undefined;
            this.onContentSizeChange = (e) => {
                const { contentSize } = e.nativeEvent;
                // Support earlier versions of React Native on Android.
                if (!contentSize) {
                    return;
                }
                if (!this.contentSize ||
                    (this.contentSize &&
                        (this.contentSize.width !== contentSize.width ||
                            this.contentSize.height !== contentSize.height))) {
                    this.contentSize = contentSize;
                    this.props.onInputSizeChanged(this.contentSize);
                }
            };
            this.onChangeText = (text) => {
                this.props.onTextChanged(text);
            };
        }
        render() {
            return (<TextInput testID={this.props.placeholder} accessible accessibilityLabel={this.props.placeholder} placeholder={this.props.placeholder} placeholderTextColor={this.props.placeholderTextColor} multiline={this.props.multiline} editable={!this.props.disableComposer} onChange={this.onContentSizeChange} onContentSizeChange={this.onContentSizeChange} onChangeText={this.onChangeText} style={[
                styles.textInput,
                this.props.textInputStyle,
                {
                    height: this.props.composerHeight,
                    ...Platform.select({
                        web: {
                            outlineWidth: 0,
                            outlineColor: 'transparent',
                            outlineOffset: 0,
                        },
                    }),
                },
            ]} autoFocus={this.props.textInputAutoFocus} value={this.props.text} enablesReturnKeyAutomatically underlineColorAndroid='transparent' keyboardAppearance={this.props.keyboardAppearance} {...this.props.textInputProps}/>);
        }
    }
    Composer.defaultProps = {
        composerHeight: MIN_COMPOSER_HEIGHT,
        text: '',
        placeholderTextColor: Color.defaultColor,
        placeholder: DEFAULT_PLACEHOLDER,
        textInputProps: null,
        multiline: true,
        disableComposer: false,
        textInputStyle: {},
        textInputAutoFocus: false,
        keyboardAppearance: 'default',
        onTextChanged: () => { },
        onInputSizeChanged: () => { },
    };
    Composer.propTypes = {
        composerHeight: PropTypes.number,
        text: PropTypes.string,
        placeholder: PropTypes.string,
        placeholderTextColor: PropTypes.string,
        textInputProps: PropTypes.object,
        onTextChanged: PropTypes.func,
        onInputSizeChanged: PropTypes.func,
        multiline: PropTypes.bool,
        disableComposer: PropTypes.bool,
        textInputStyle: StylePropType,
        textInputAutoFocus: PropTypes.bool,
        keyboardAppearance: PropTypes.string,
    };

```
