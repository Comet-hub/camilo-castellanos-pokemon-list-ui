import { css, unsafeCSS } from 'lit-element';
import * as foundations from '@bbva-web-components/bbva-foundations-styles';

export default css`
:host {
  display: block;
  box-sizing: border-box;
}

:host([hidden]),
[hidden] {
  display: none !important;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

bbva-core-heading {
  margin-bottom: 1rem;
  font-weight: bold;
  text-align: center;
}

[aria-level="1"] {
  font-size: 2.5rem;
}

[aria-level="2"] {
  font-size: 2rem;
}

[aria-level="3"] {
  font-size: 1.5rem;
}

[aria-level="4"] {
  font-size: 1.25rem;
}

[aria-level="5"] {
  font-size: 1rem;
}

[aria-level="6"] {
  font-size: 0.75rem;
}

.content-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
}

.list {
  margin: 2rem 0;
  display: flex;
  justify-content: center;
}

.list__grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.03), 0px 2px 30px rgba(0, 0, 0, 0.08), 0px 0px 1px rgba(0, 0, 0, 0.03);
  border-radius: 1rem;
  padding: 8px;
  transition: transform 0.2s;
  cursor: pointer;
}

.card:hover {
  transform: scale(1.1);
}

.card__small {
  margin: 0.5rem 0;
  font-size: 0.75rem;
}

.card__tags {
  display: flex;
  justify-content: space-around;
  margin: 0.5rem 0;
  width: 100%;
  font-size: 0.75rem;
}

.modal {
  border: none;
  border-radius: 1rem;
}

.modal-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
`;
