import { forwardRef } from "react";
import styled from "styled-components";

interface IProps {
  type: string;
  placeholder: string;
  hasError?: boolean;
}

const SInput = styled.input<IProps>`
  width: 100%;
  border-radius: 3px;
  padding: 7px;
  background-color: #fafafa;
  border: 0.5px solid
    ${(props) => (props.hasError ? "tomato" : props.theme.borderColor)};
  margin-top: 5px;
  box-sizing: border-box;
  &::placeholder {
    font-size: 12px;
  }
  &:focus {
    border-color: rgb(38, 38, 38);
  }
`;

function Input(props: IProps, ref: React.Ref<HTMLInputElement>) {
  return <SInput {...props} ref={ref} />;
}

export default forwardRef(Input);
