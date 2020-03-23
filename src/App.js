import React, { Fragment, useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import trello from './api';
import './App.css';

const text = css`
  font-family: sans-serif;
  font-weight: lighter;
  font-size: 16px;
  color: #424242;
`;

const Container = styled.div`
  margin: 64px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  background-color: white;
  width: 600px;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 1px 22px -12px rgba(0, 0, 0, 0.5);
  z-index: 0;
`;

const Label = styled.label`
  margin-top: 40px;
  margin-bottom: 16px;
  ${text}
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const InputElement = styled.input`
  flex: 1;
  padding: 8px;
  font-size: 16px;
  background: #fcfcfc;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  outline: none;
  ${text};
  font-weight: bolder;
`;

const AutocompleteContainer = styled.div`
  position: absolute;
  box-shadow: 0 1px 22px -12px rgba(0, 0, 0, 0.5);
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  background-color: white;
  z-index: 1;
  width: 632px;
  margin-left: -48px;
  top: 40px;
`;

const Error = styled.p`
  ${text};
  font-size: 12px;
  color: red;
  margin-top: 16px;
`;

const AutocompleteElement = styled.p`
  cursor: pointer;
  padding: 16px 32px;
  &:hover {
    background-color: #eeeeff;
  }
`;

const Button = styled.a`
  padding: 16px;
  margin: 32px 0;
  border-radius: 8px;
  background-color: #424242;
  text-decoration: none;
  ${text};
  color: white;
  font-weight: bolder;
  text-align: center;
  cursor: pointer;
`;

function Input({ value, onChange, field, state, setState, label }) {
  const [focus, setFocus] = useState(false);
  const [error, setError] = useState(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    (async () => {
      if (focus && field.autocompleteAction) {
        try {
          const newState = await trello[field.autocompleteAction](state);
          setState(newState);
          setAutocomplete(newState.lastAdded);
        } catch (e) {
          if (field.autocompleteError) {
            setError(field.autocompleteError);
          }
        }
      } else if (autocomplete) {
        setError(null);
        setState({ ...state, [autocomplete]: null });
        setAutocomplete(null);
      } else {
        setError(null);
      }
    })();
  }, [field, focus, setState, state, autocomplete]);

  return (
    <>
      <Label htmlFor={field.slug}>{label}</Label>
      <InputContainer>
        <InputElement
          autoComplete="none"
          name={field.slug}
          id={field.slug}
          onFocus={() => setFocus(true)}
          onBlur={() => setTimeout(() => setFocus(false), 200)}
          value={value}
          onChange={onChange}
        />
        {autocomplete && (
          <AutocompleteContainer>
            {state[autocomplete].map(e => (
              <AutocompleteElement
                onClick={() =>
                  onChange({
                    target: {
                      value: {
                        ...e,
                        submitValue: field.autocompleteSubmit
                          ? e[field.autocompleteSubmit]
                          : e,
                      },
                    },
                  })
                }
                key={e.id}
              >
                {e[field.autocompleteDisplay]}
              </AutocompleteElement>
            ))}
          </AutocompleteContainer>
        )}
        {error && <Error>{error}</Error>}
      </InputContainer>
    </>
  );
}

function App() {
  const [ready, setReady] = useState(false);
  const [state, setState] = useState({});

  /**
   * Initialize the trello client API
   */
  useEffect(() => {
    window.Trello.authorize({
      name: 'Integrations Demo',
      persiste: true,
      scope: { read: true, write: true, account: false },
      success: () => {
        setReady(true);
      },
    });
  }, []);

  if (!ready) {
    return null;
  }

  console.log({ state });

  return (
    <Container>
      {trello.getFields('createCard').map((field, index) => (
        <Fragment key={index}>
          <Input
            label={field.display}
            value={
              state[field.slug]
                ? state[field.slug][field.autocompleteDisplay] ||
                  state[field.slug]
                : ''
            }
            state={state}
            setState={setState}
            onChange={e => setState({ ...state, [field.slug]: e.target.value })}
            field={field}
          />
        </Fragment>
      ))}
      <Button onClick={() => console.log('ok') || trello.createCard(state)}>
        {trello.schema.createCard.display}
      </Button>
    </Container>
  );
}

export default App;
