/* eslint-disable @typescript-eslint/no-explicit-any */
export const CONTRACT_ADDRESS_ETHERLINK = "0x4eA0A867d0A0806be2e2c370f8e0B0472efC0b84";
export const CONTRACT_ADDRESS_MOONBEAM = "0x040838b1b1186B4b7555F241012AF0FFa7dc9dCB";
export const USDC_ETHERLINK="0x796Ea11Fa2dD751eD01b53C372fFDB4AAa8f00F9";
export const USDC_MOONBEAM="0x931715FEE2d06333043d11F658C8CE934aC61D0c";
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
