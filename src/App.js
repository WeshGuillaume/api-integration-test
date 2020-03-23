import React, { Fragment, useState, useEffect } from 'react';
import trello from './api';
import './App.css';
import {
  Container,
  InputContainer,
  InputElement,
  AutocompleteContainer,
  AutocompleteElement,
  Label,
  Error,
  Title,
  ButtonText,
  Button,
} from './style';

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
                        submitValue:
                          console.log(field) || field.autocompleteSubmit
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
      <Title>{trello.schema.createCard.display}</Title>
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
            onChange={e =>
              console.log({ e }) ||
              setState({ ...state, [field.slug]: e.target.value })
            }
            field={field}
          />
        </Fragment>
      ))}
      <Button onClick={() => (trello.createCard(state), setState({}))}>
        <ButtonText>{trello.schema.createCard.display}</ButtonText>
      </Button>
    </Container>
  );
}

export default App;
