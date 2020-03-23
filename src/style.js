import styled from 'styled-components';

export const Container = styled.div`
  background: #eff0f1;
  box-shadow: -5px -5px 12px 0 rgba(255, 255, 255, 0.5), 5px 5px 12px 0 #e3e7ec;
  margin: 64px;
  padding: 32px;
  padding-bottom: 64px;
  display: flex;
  flex-direction: column;
  width: 600px;
  border-radius: 20px;
  z-index: 0;
  position: relative;
`;

export const Title = styled.h2`
  font-family: Muli;
  font-weight: 900;
  font-size: 53px;
  max-width: 400px;
  background-color: #a6bbd0;
  color: transparent;
  text-shadow: 2px 2px 3px rgba(255, 255, 255, 0.5);
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
`;

export const Label = styled.label`
  margin-top: 40px;
  margin-bottom: 16px;
  font-family: Muli;
  font-weight: 700;
  font-size: 16px;
  color: #a6bbd0;
`;

export const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

export const InputElement = styled.input`
  flex: 1;
  padding: 16px;
  font-size: 16px;
  border-radius: 25px;
  outline: none;
  border: 0;
  font-weight: 900;
  background-color: #eff0f1;
  box-shadow: -9px -9px 20px 0 rgba(255, 255, 255, 0.5), 9px 9px 20px 0 #e3e7ec;
  font-family: Muli;
  color: #8fa1b3;
`;

export const AutocompleteContainer = styled.div`
  position: absolute;
  border-radius: 20px;
  z-index: 1;
  width: 632px;
  margin-left: -48px;
  top: 40px;
  background-color: #eff0f1;
  box-shadow: 18px 18px 20px 0 #e3e7ec;
  overflow: hidden;
`;

export const Error = styled.p`
  font-family: Muli;
  font-size: 14px;
  font-size: 12px;
  color: red;
  margin-top: 16px;
`;

export const AutocompleteElement = styled.p`
  cursor: pointer;
  padding: 16px 32px;
  font-family: Muli;
  font-size: 14px;
  font-weight: 900;
  color: #a3b5c8;
  &:hover {
    background-color: rgba(255, 203, 196, 0.25);
  }
`;

export const Button = styled.a`
  position: absolute;
  margin: auto;
  left: 0;
  right: 0;
  bottom: -32px;
  padding: 16px;
  border-radius: 32px;
  text-decoration: none;
  color: white;
  font-weight: bolder;
  text-align: center;
  cursor: pointer;
  max-width: 50%;
  background: #a7d6db;
  transition: 0.15s all ease-in-out;
  box-shadow: 0 4px 0 0 #7cbbbf, -3px -3px 6px 0 rgba(255, 255, 255, 0.5),
    3px 3px 6px 0 rgba(155, 154, 154, 0.52);
  &:hover {
    box-shadow: 0 5px 0 0 #7cbbbf, -6px -6px 10px 0 rgba(255, 255, 255, 0.7),
      8px 8px 10px 0 rgba(130, 130, 130, 0.5);
    bottom: -28px;
  }
  &:active {
    box-shadow: 0 1px 0 0 #7cbbbf, -3px -3px 6px 0 rgba(255, 255, 255, 0.5),
      3px 3px 6px 0 rgba(155, 154, 154, 0.52);
    bottom: -35px;
  }
`;

export const ButtonText = styled.span`
  font-family: Muli;
  font-size: 20px;
  font-weight: 900;
  text-align: center;
  background-color: #81bcc0;
  color: transparent;
  /* text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.5); */
  -webkit-background-clip: text;
  -moz-background-clip: text;
  background-clip: text;
`;
