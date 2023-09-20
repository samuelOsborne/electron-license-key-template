import { useRef, useState } from 'react'
import '../App.css'
import { useNavigate } from 'react-router-dom';
import { useLicenseKey } from './LicenseKeyProvider';

function LicenseKeyEntry() {
  const [errorMessage, setErrorMessage] = useState('');
  const errorMessageLabel = useRef<HTMLLabelElement>(null);
  const licenseKeyRef = useRef<HTMLInputElement>(null);

  const licenseKey = useLicenseKey();
  const navigate = useNavigate();

  const handleActivateLicenseKey = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();

    if (licenseKeyRef.current) {
      let licenseKeyValue = licenseKeyRef.current.value;

      licenseKeyValue = licenseKeyValue.replace(/\s/g, '');

      if (licenseKeyValue === '') {
        setErrorMessage('License key cannot be empty.');
        return;
      }

      try {
        const response = await licenseKey.handleActivateLicenseKey(licenseKeyValue);

        if (response.error) {
          setErrorMessage(response.errorMessage);
          return;
        } else {
          navigate('/app');
        }
      } catch (error: any) {
        setErrorMessage(error.message);
      }
    }
  }


  return (
    <div className="relative flex flex-col justify-center overflow-hidden">
      <div className="w-full p-6 m-auto bg-white rounded-md shadow-md lg:max-w-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-dark text-gray-600">Your app</h1>
        <form className="space-y-4">
          <div>
            <label className="label">
              <span className="text-base label-text">Please enter your license key</span>
            </label>
            <input ref={licenseKeyRef} type="text" placeholder="License key" className="w-full input input-bordered input-primary" />
          </div>
          {
            errorMessage !== '' && (
              <>
                <span ref={errorMessageLabel} className="text-xs label-text text-error display-none">{errorMessage}</span>
                <br />
              </>
            )
          }
          <div className="flex flex-row gap-8 justify-center">
            <div>
              <button className="btn btn-primary" onClick={handleActivateLicenseKey}>Activate license</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LicenseKeyEntry
