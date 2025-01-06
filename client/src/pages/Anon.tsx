import {
  LaunchProveModal,
  LogInWithAnonAadhaar,
  useAnonAadhaar,
} from "@anon-aadhaar/react";
import { useEffect } from "react";

const Anon = () => {
  const [AnonAadhaar] = useAnonAadhaar();

  useEffect(() => {
    console.log("Country Identity status: ", AnonAadhaar.status);
  }, [AnonAadhaar]);

  return (
    <div>
      <h1>Anonymous Page</h1>
      <LogInWithAnonAadhaar nullifierSeed={1234} />
      <LaunchProveModal
        signal="yourSignalIdentifier"
        buttonStyle={{ backgroundColor: "blue", color: "white" }}
        buttonTitle="Generate a proof"
        nullifierSeed={1234}
      />
    </div>
  );
};

export default Anon;
