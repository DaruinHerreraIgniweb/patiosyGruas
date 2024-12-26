import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    KeyboardAvoidingView,
    ScrollView,Platform
} from 'react-native';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { Input } from 'react-native-elements';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Button from '../components/Button';
import OtherPerson from './OtherPerson';
export const MAIN_COLOR = colors.BIDTAXIPRIMARY;
import { fonts } from '../common/font';

export default function DeliveryModal(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0; 

    const {bookingModalStatus, onPressCancel, bookNow, tripInstructions, setTripInstructions, roundTrip, setRoundTrip, payment_mode, setPaymentMode, radioProps, profileData, setProfileData, auth, bookModelLoading, instructionData, setInstructionData, otherPerson, setOtherPerson } = props;

    const filteredRadioProps = radioProps.filter(prop => prop.cat == 'wallet');

    return (
    <Modal
        animationType="fade"
        transparent={true}
        visible={bookingModalStatus}
    >
        <View style={styles.centeredView}>
            <KeyboardAvoidingView style={styles.form} behavior={Platform.OS == "ios" ? "padding" : (__DEV__ ? null : "padding" )}>
                <View style={styles.modalView}>
                    <View style={{ marginTop: auth && auth.profile && auth.profile.firstName && auth.profile.email ? 0 : 10, marginBottom: 10, width:'100%'}}>
                        {auth && auth.profile && !auth.profile.firstName?
                        <View style={styles.textInputContainerStyle}>
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={t('first_name_placeholder')}
                                placeholderTextColor={colors.DRIVER_TRIPS_TEXT}
                                value={profileData.firstName}
                                keyboardType={'email-address'}
                                inputStyle={[styles.inputTextStyle,{textAlign:isRTL?"right":'left'}]}
                                onChangeText={(text) => { setProfileData({ ...profileData, firstName: text }) }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        : null }
                        {auth && auth.profile && !auth.profile.lastName ?
                        <View style={styles.textInputContainerStyle}>
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={t('last_name_placeholder')}
                                placeholderTextColor={colors.DRIVER_TRIPS_TEXT}
                                value={profileData.lastName}
                                keyboardType={'email-address'}
                                inputStyle={[styles.inputTextStyle,{textAlign:isRTL?"right":'left'}]}
                                onChangeText={(text) => { setProfileData({ ...profileData, lastName: text }) }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        : null }
                        {auth && auth.profile && !auth.profile.email ?
                        <View style={styles.textInputContainerStyle}>
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={t('email_placeholder')}
                                placeholderTextColor={colors.DRIVER_TRIPS_TEXT}
                                value={profileData.email}
                                keyboardType={'email-address'}
                                inputStyle={[styles.inputTextStyle,{textAlign:isRTL?"right":'left'}]}
                                onChangeText={(text) => { setProfileData({ ...profileData, email: text }) }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                                autoCapitalize='none'
                            />
                        </View>
                        : null }

                        {/* 
                        <OtherPerson
                            otherPerson = {otherPerson}
                            setOtherPerson={setOtherPerson}
                            setInstructionData={setInstructionData}
                            instructionData={instructionData}
                            auth={auth}
                        />
                        */}

                        {/* 
                        <Text style={{ color: colors.BLACK,fontFamily:fonts.Bold, fontSize: 16,textAlign:isRTL? 'right':'left',marginLeft:isRTL?0:10, marginRight:isRTL?10:0 }}>{t('roundTrip')}</Text>
                        <RadioForm
                            initial={0}
                            formHorizontal={true}
                            labelHorizontal={false}
                            buttonColor={MAIN_COLOR}
                            labelColor={colors.RADIO_BUTTON}
                            style={{ marginTop: 10 }}
                            labelStyle={{ marginLeft: 0 }}
                            selectedButtonColor={colors.HEADER}
                            selectedLabelColor={colors.HEADER}
                        >
                            <RadioButton labelHorizontal={true} style={{flexDirection:isRTL?'row-reverse':'row',marginLeft:isRTL?0:10, marginRight:isRTL?10:0}}>
                                <RadioButtonInput
                                    obj={{ label: t('yes'), value: 1}}
                                    isSelected={roundTrip}
                                    onPress={()=>setRoundTrip(true)}
                                    buttonSize={15}
                                    buttonOuterSize={26} 
                                    buttonWrapStyle={{marginLeft: 10}}
                                    buttonColor={MAIN_COLOR}
                                />
                                <RadioButtonLabel
                                    obj={{ label: t('yes'), value: 1}}
                                    labelHorizontal={true}
                                    onPress={()=>setRoundTrip(true)}
                                    selectedLabelColor={colors.RADIO_BUTTON}
                                    labelColor={colors.HEADER}
                                />
                            </RadioButton>
                            <RadioButton labelHorizontal={true} style={{flexDirection:isRTL?'row-reverse':'row',marginLeft:isRTL?0:20, marginRight:isRTL?20:0}}>
                                <RadioButtonInput
                                    obj={{ label: t('no'), value: 0}}
                                    isSelected={!roundTrip}
                                    onPress={()=>setRoundTrip(false)}
                                    buttonSize={15}
                                    buttonOuterSize={26} 
                                    buttonWrapStyle={{marginLeft: 10}}
                                    buttonColor={MAIN_COLOR}
                                    selectedButtonColor={colors.HEADER}
                                />
                                <RadioButtonLabel
                                    obj={{ label: t('no'), value: 0}}
                                    labelHorizontal={true}
                                    onPress={()=>setRoundTrip(false)}
                                    selectedLabelColor={colors.HEADER}
                                    labelColor={colors.HEADER}
                                />
                            </RadioButton>
                        </RadioForm>
                        
                        */}
                    </View>
                    <View style={styles.textInputContainerStyle}>
                        <Input
                            editable={true}
                            underlineColorAndroid={colors.TRANSPARENT}
                            placeholder={t('tripInstructions')}
                            placeholderTextColor={colors.DRIVER_TRIPS_TEXT}
                            value={tripInstructions}
                            keyboardType={'email-address'}
                            inputStyle={[styles.inputTextStyle,{textAlign:isRTL?"right":'left'}]}
                            onChangeText={(text) => { setTripInstructions(text) }}
                            inputContainerStyle={styles.inputContainerStyle}
                            containerStyle={styles.textInputStyle}
                        />
                    </View>
                    <View style={styles.textInputContainerStyle}>
                        <Text style={{fontSize:18, paddingLeft:10,paddingBottom:15,fontFamily:fonts.Regular}}>{t('payment_mode')}</Text>
                    </View>
                    <View style={styles.textInputContainerStyle}>
                        <RadioForm
                            radio_props={filteredRadioProps}
                            initial={payment_mode}
                            animation={false}
                            formHorizontal={true}
                            labelHorizontal={true}
                            buttonColor={MAIN_COLOR}
                            buttonSize={15}
                            buttonOuterSize={26} 
                            buttonWrapStyle={{marginLeft: 10}}
                            labelColor={colors.HEADER}
                            style={[{marginBottom: 20},isRTL ? { marginRight: 10 } : { marginLeft: 10 }]}
                            labelStyle={[isRTL ? { marginRight: 10 } : { marginRight: 10 },{fontFamily:fonts.Regular}]}
                            selectedButtonColor={MAIN_COLOR}
                            selectedLabelColor={colors.HEADER}
                            onPress={(value) => {
                                setPaymentMode(value);
                            }}
                        />
                    </View>
                    <View style={{ flexDirection:isRTL?'row-reverse':'row', alignSelf: 'center'}}>
                        <Button
                            title={t('cancel')}
                            loading={false}
                            loadingColor={{ color: colors.WHITE }}
                            buttonStyle={[styles.modalButtonTextStyle]}
                            style={[styles.modalButtonStyle,{backgroundColor:colors.RED, margin : 3 }]}
                            btnClick={onPressCancel}
                        />

                        <Button
                            title={t('confirm')}
                            loading={bookModelLoading}
                            loadingColor={{ color: colors.WHITE }}
                            buttonStyle={[styles.modalButtonTextStyle]}
                            style={[styles.modalButtonStyle,{backgroundColor:colors.GREEN, margin : 3 }]}
                            btnClick={bookNow}
                        />
                    </View>
                    </View>
            </KeyboardAvoidingView>
        </View>
    </Modal>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.BACKGROUND
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 10,
        padding:15,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        alignItems: "center"
    },
    inputContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.BACKGROUND_PRIMARY
    },
    textInputStyle: {
    },
    modalButtonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.BUTTON_RIGHT,
        width: 100,
        height: 50,
        elevation: 0,
        borderRadius: 10
    },
    modalButtonTextStyle: {
        color: colors.WHITE,
        fontFamily: fonts.Bold,
        fontSize: 18
    },
    rateViewStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15
    },
    rateViewTextStyle: {
        fontSize: 60,
        color: colors.START_TRIP,
        fontFamily: fonts.Bold,
        textAlign: "center"
    },
    inputTextStyle:{
        fontFamily:fonts.Regular
    }
});
