/* eslint-disable @typescript-eslint/no-explicit-any */
export const CONTRACT_ADDRESS_ETHERLINK = "0x2dcfe33d4797415c9775c9e7a7a59d77708b3da1";
export const CONTRACT_ADDRESS_MOONBEAM = "0xC7EdD39368cCa90affbD9656D78b25e77a2C08Bb";
export const tokenAddress = "0x2dcfe33d4797415c9775c9e7a7a59d77708b3da1";
export const DEFAULT_GAS_PERCENTAGE = 150;

export const colorStyles = {
  control: (styles: any) => ({
    ...styles,
    marginTop: "8px",
    marginBottom: "16px",
    backgroundColor: "#292929",
    fontFamily: "GilmerMedium",
    borderRadius: "4px",
    width: "100%",
    outline: "none",
    border: "none",
    fontSize: "14px",
  }),
  option: (styles: any) => ({
    ...styles,
    backgroundColor: "#292929",
    color: "#FFF",
    outline: "none",
    border: "none",
  }),
  menuList: (styles: any) => ({
    ...styles,
    margin: "0",
    padding: "0",
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: "#757575",
  }),
  input: (styles: any) => ({
    ...styles,
    color: "#FFF",
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: "#FFF",
  }),
};
