import styled from 'styled-components'

export const Loading = styled.span`
  display: inline-block;
  text-align: center;
  justify-self: center;
  justify-content: center;
  align-content: center;
  width: 4rem;
  height: 4rem;
  z-index: 10;
  border: 0.75rem solid #f3f3f3;
  border-top: 0.75rem solid #7cc5ea;
  border-radius: 50%;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`

export const RecoverContainer = styled.div`
  display: flex;
  background: #7cc5ea;
  justify-content: center;
  align-content: center;
  width: 100vw;
  height: 100vh;
  .icon {
    margin: 1rem 2.5rem;
  }
`

export const CardRecover = styled.div`
  margin-top: 5rem;
  justify-self: center;
  justify-content: center;
  width: 80vw;
  height: 56vh;
  min-height: 50vh;
  background: white;
  border-radius: 8px;
  padding: 2rem;
  animation: 0.8s ease 0s 1 normal forwards enterRight;

  h3, h2, p {
    line-height: 1.25rem;
    color:#696969;
    font-family: 'Concert One', cursive;
    padding-bottom: 1rem;
  }
  button {
      cursor: pointer;
      background:#7CC5EA;
      border-radius: 20px;
      height: 40px;
      width: 100%;
      max-height: 50%;
      border: none;
      margin-top: 40px;
      font-family: Roboto;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
      color: white;
      transition:0.5s;
          &:hover {
            color: white;
            background:#7ceadb;
          }
          &:disabled {
            background: #c1c1c1;
          }
  }
  input {
      margin-top: 1rem;
      border-top: none;
      border-right: none;
      border-left: none;
      border-bottom: 1px solid rgb(135, 134, 134);
      width: 100%;
      padding: 10px 32px 10px 14px;
      font-size: 14px;
  }
  a {
    color: #5983b1;
    padding-top: 1rem;
    padding-bottom: 0.25rem;
    display: block;
    text-align: center;
    text-decoration: none;
    font-size: 12px;
  }
  /* Animation enterRight */
  @keyframes enterRight {
    0% {
      position: relative;
      left: -50px;
      opacity: 0.4;
      }
    100% {
      position: relative;
      left: 0;
      opacity: 1;
    }
  }
  /* Desktop */
  @media only screen and (min-width: 768px) {
    width: 30vw;
    max-width: 50vw;
    height: 40vh;
    min-height: 30vh;
  }
  a {
    padding-top: 1.5rem;
    padding-bottom: 0.25rem;
    font-size: 14px;
  }
`