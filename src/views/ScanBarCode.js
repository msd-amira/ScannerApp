import {useEffect, useState} from "react";
import {BarCodeScanner} from "expo-barcode-scanner";
import {StyleSheet, Button, Text, View, Vibration, Alert} from "react-native";
import {Audio} from 'expo-av';

export default function ScanBarCode() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(true);
    const [orderCode, setOrderCode] = useState(false);
    const [positionCode, setPositionCode] = useState(false);
    const [validOrderCode, setValidOrderCode] = useState(true);
    const [validPositionCode, setValidPositionCode] = useState(true);
    const [sound, setSound] = useState();

    //Request camera permission && Unloading Sound
    useEffect(() => {
        askForCameraPermission();
        return sound ? () => {
            sound.unloadAsync();
        } : undefined;
    }, [sound]);

    async function playSound() {
        const {sound} = await Audio.Sound.createAsync(
            require('../../assets/sounds/beep-fail.mp3')
        );
        setSound(sound);
        await sound.playAsync();
    }

    const askForCameraPermission = () => {
        (async () => {
            const {status} = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted')
        })()
    }

    const createErrorAlert = data => {
        Alert.alert('Error', 'This barcode '+ data +' is wrong.', [
            {text: 'OK'},
        ]);
    }

    const initialValues = () => {
        setPositionCode('')
        setOrderCode('')
        setValidOrderCode(true)
        setValidPositionCode(true)
    }

    // What happens when we scan the bar code
    const handleBarCodeScanned = async ({type, data}) => {
        setScanned(true)
        let isValid = null
        await initialValues()
        if (data.toString().length === 5) {
            isValid = data.toString().match(/[^0-9]/g) === null
            setValidPositionCode(isValid)
            setPositionCode(data)
        }
        if (data.toString().length === 8) {
            isValid = data.toString().match(/[^A-Z0-9]/g) === null
            setValidOrderCode(isValid)
            setOrderCode(data)
        }
        isValid === null ? createErrorAlert(data) : undefined
        if (!isValid) {
            await playSound();
            Vibration.vibrate();
        }
    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>)
    }
    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{margin: 10}}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()}/>
            </View>)
    }
    // Return the View
    return (
        <View>
            <View>
                <View style={styles.barcodeBox}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{height: '300%', width: '3000%'}}
                    />
                </View>
                <Button title={'Scan barcode'} color='#0275d8' onPress={() => { setScanned(false) }} />

                <Text style={styles.mainText}>Order:</Text>
                <Text style={[styles.mainText, validOrderCode ? styles.validCode : styles.invalidCode]}>{orderCode}</Text>
            </View>
            <View>
                <Text style={styles.mainText}>Position:</Text>
                <Text style={[styles.mainText, validPositionCode ? styles.validCode : styles.invalidCode]}>{positionCode}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    mainText: {
        fontSize: 16,
        margin: 20,
        marginLeft: 0
    },
    validCode: {
        borderBottomColor: "green",
        borderBottomWidth: 1.5
    },
    invalidCode: {
        borderBottomColor: "red",
        borderBottomWidth: 1.5
    },
    barcodeBox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '35%',
        width: '90%',
        overflow: 'hidden',
        borderRadius: 30,
        margin: '5%'
    }
});
