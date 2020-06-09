import React, { useState, useEffect } from 'react'
import { Feather as Icon } from "@expo/vector-icons";
import { View, ImageBackground, Text, Image, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { RectButton, TextInput } from "react-native-gesture-handler"
import { useNavigation } from "@react-navigation/native"
import RNPickerSelect from 'react-native-picker-select'
import axios from "axios"

interface IBGEUfResponse {
    id: number,
    sigla: string
}

interface IBGECityResponse {
    id: number,
    nome: string
}

interface UfItem {
    label: string,
    value: string
}

interface CityItem {
    label: string,
    value: string
}

const Home = () => {

    const [ufs, setUfs] = useState<UfItem[]>([])
    const [cities, setCities] = useState<CityItem[]>([])

    const [uf, setUf] = useState("")
    const [city, setCity] = useState("")

    const navigation = useNavigation()

    function handleNavigateToPoints() {
        navigation.navigate("Points", { uf: uf, city: city })
    }

    useEffect(() => {
        axios.get<IBGEUfResponse[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
            .then(response => {
                const ufInitials = response.data.map(uf => {
                    return {
                        label: uf.sigla,
                        value: uf.sigla
                    }
                })
                setUfs(ufInitials)
            })
    }, [])

    useEffect(() => {
        if (uf === '') {
            return
        }

        axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
            .then(response => {
                const citiesNames = response.data.map(city => {
                    return {
                        label: city.nome,
                        value: city.nome
                    }
                })
                setCities(citiesNames)
            })
    }, [uf])

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ImageBackground
                style={styles.container}
                source={require('../../assets/home-background.png')}
                imageStyle={{ width: 274, height: 268 }}
            >
                <View style={styles.main}>
                    <Image source={require('../../assets/logo.png')} />
                    <Text style={styles.title}>
                        Seu marketplace de coleta de resíduos
                </Text>
                    <Text style={styles.description}>
                        Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
                </View>
                <View style={styles.footer}>
                    <RNPickerSelect
                        placeholder="Seleciona UF"
                        onValueChange={(value) => setUf(value)}
                        items={ufs}
                    />
                    <RNPickerSelect
                        placeholder="Selecione a Cidade"
                        onValueChange={(value) => setCity(value)}
                        items={cities}
                    />
                    <RectButton style={styles.button} onPress={handleNavigateToPoints}>
                        <View style={styles.buttonIcon}>
                            <Text>
                                <Icon name="arrow-right" color="#fff" size={24} />
                            </Text>
                        </View>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </RectButton>
                </View>
            </ImageBackground>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32,
    },

    main: {
        flex: 1,
        justifyContent: 'center',
    },

    title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
    },

    description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
    },

    footer: {},

    select: {},

    input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
    },

    button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
    },

    buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
    }
});

export default Home