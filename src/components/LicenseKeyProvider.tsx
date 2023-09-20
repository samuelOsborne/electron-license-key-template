import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getLicenseKey, setLicenseKey } from "../data/IPCMessages";
import { LemonAPIResponse, LemonAPIResponseValidateKey } from "../types/lemonSqueezy";
import { useNavigate } from "react-router-dom";

const LicenseKeyContext = createContext({} as LicenseKeyProviderValue);

export function useLicenseKey() {
    return useContext<LicenseKeyProviderValue>(LicenseKeyContext);
}

export interface LicenseKeyProviderProps {
    children: string | JSX.Element | JSX.Element[] | React.ReactNode;
}

export interface apiMessage {
    success: boolean;
    error: boolean;
    errorMessage: string;
}

export interface LicenseKeyProviderValue {
    checkIfLicenseKeyIsActivated: () => Promise<apiMessage>,
    handleActivateLicenseKey: (licenseKey: string) => Promise<apiMessage>,
}

export const LicenseKeyProvider = ({ children }: LicenseKeyProviderProps) => {
    const navigate = useNavigate();
    const [, setLoading] = useState(true)


    const checkIfLicenseKeyIsActivated = useCallback(async (): Promise<apiMessage> => {
        const licenseKey = await getLicenseKey();

        if (!licenseKey) {
            return {
                error: true,
                success: false,
                errorMessage: 'No license key found.'
            };
        }

        console.log("License key: " + licenseKey)

        const ret = await fetch(import.meta.env.VITE_LEMON_SQUEEZY_VALIDATE_URL,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ license_key: licenseKey })
            }
        ).then((response) => {
            return response.json();
        }).then((response: LemonAPIResponseValidateKey) => {
            setLoading(false);

            if (response.error) {
                console.log(response.error);
                return {
                    error: true,
                    success: false,
                    errorMessage: response.error
                }
            }

            console.log(response);

            if (response.valid && response.license_key.status !== 'inactive') {
                setLicenseKey(response.license_key.key);
                return {
                    error: false,
                    success: true,
                    errorMessage: ''
                };
            } else {
                return {
                    error: true,
                    success: false,
                    errorMessage: 'License key is no longer valid or has been deactivated.'
                }
            }
        }).catch((error) => {
            return {
                error: true,
                success: false,
                errorMessage: error.message
            }
        })


        return ret ?? {
            error: false,
            success: true,
            errorMessage: ''
        };
    }, []);

    const handleActivateLicenseKey = async (licenseKey: string): Promise<apiMessage> => {
        if (licenseKey === '') {
            throw Error('Please enter a valid license key.')
        }

        const ret = await fetch(import.meta.env.VITE_LEMON_SQUEEZY_ACTIVATE_URL,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ license_key: licenseKey, instance_name: import.meta.env.VITE_LEMON_SQUEEZY_INSTANCE_NAME })
            }
        ).then((response) => {
            return response.json();
        }).then((response: LemonAPIResponse) => {
            if (response.error) {
                setLicenseKey('');
                return {
                    error: true,
                    success: false,
                    errorMessage: response.error
                }
            }

            console.log(response);

            setLicenseKey(response.license_key.key);

            if (response.activated) {
                return {
                    error: false,
                    success: true,
                    errorMessage: ''
                }
            }
        }).catch((error) => {
            return {
                error: true,
                success: false,
                errorMessage: error.message
            }
        })

        return ret ?? {
            error: false,
            success: true,
            errorMessage: ''
        }
    }

    useEffect(() => {
        console.log("Provider checking if license key is activated...")

        const call = async () => {
            await checkIfLicenseKeyIsActivated().then((response) => {
                if (response.error) {
                    console.log(response.errorMessage);
                    navigate('/');
                } else {
                    navigate('/app');
                }
            });
        }

        call();
    }, [checkIfLicenseKeyIsActivated, navigate]);

    const value = {
        checkIfLicenseKeyIsActivated,
        handleActivateLicenseKey,
    }

    return (
        <>
            <LicenseKeyContext.Provider value={value}>
                {children}
            </LicenseKeyContext.Provider>
        </>
    )

};