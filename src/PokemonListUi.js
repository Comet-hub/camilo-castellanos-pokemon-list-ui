import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './pokemon-list-ui-styles.js';

import '@bbva-web-components/bbva-core-heading/bbva-core-heading.js';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
import '@bbva-web-components/bbva-foundations-spinner/bbva-foundations-spinner.js';
import '@pokedex/pokemon-list-dm/pokemon-list-dm.js';

export class PokemonListUi extends LitElement {
  static get properties() {
    return {
      pokemonList: {
        type: Array,
      },
      isLoading: {
        type: Boolean,
      },
      page: {
        type: String,
      },
    };
  }

  constructor() {
    super();
    this.page = 'https://pokeapi.co/api/v2/pokemon';
    this.isLoading = false;
    this.pokemonList = [];
  }
  async firstUpdated() {
    this.modal = this.shadowRoot.querySelector('dialog');
    this.spinner = this.shadowRoot.querySelector('bbva-foundations-spinner');
    this.pokemonListDm = this.shadowRoot.querySelector('pokemon-list-dm');
    this.pokemonList = await this.pokemonListDm.loadPokemons();
    this.addEventListener(
      'load-pokemon-request-started',
      () => (this.isLoading = true),
    );
    this.addEventListener(
      'load-pokemon-request-success',
      () => (this.isLoading = false),
    );
  }

  static get styles() {
    return [styles, getComponentSharedStyles('pokemon-list-ui-shared-styles')];
  }

  render() {
    return html`
      <bbva-core-heading level="2"
        ><slot name="list-title"></slot
      ></bbva-core-heading>

      <div class="content-container">
        <div class="list">${this._gridTpl}</div>
        ${this.isLoading
          ? html`<bbva-foundations-spinner with-mask>
            </bbva-foundations-spinner>`
          : html`<bbva-button-default @click=${(e) => this.loadMorePokemons()}>
              <slot name="load-button-text"></slot>
            </bbva-button-default>`}
      </div>
      <dialog class="modal">
        <div class="modal-container">
          <slot name="modal-text"></slot>
          <bbva-button-default @click=${() => this.modal.close()}
            ><slot name="close-button-text"></slot
          ></bbva-button-default>
        </div>
      </dialog>
      <pokemon-list-dm page="${this.page}"></pokemon-list-dm>
      <slot></slot>
    `;
  }

  get _gridTpl() {
    return html`<div class="list__grid">
      ${this.pokemonList.map(
        (pokemon) => html`
          <div class="card" @click=${(e) => this.checkEvolution(pokemon)}>
            <img
              class="card__img"
              src="${pokemon.sprites.other.home.front_default}"
              alt="${pokemon.name}"
              height="100"
              width="100"
            />
            <p class="card__small">no. ${pokemon.id}</p>
            <bbva-core-heading level="5">
              ${pokemon.name.toUpperCase()}
            </bbva-core-heading>
            <p class="card__tags">
              ${pokemon.types.map(
                (type) =>
                  html`<span class="card__tag">
                    ${type.type.name.toUpperCase()}
                  </span>`,
              )}
            </p>
          </div>
        `,
      )}
    </div>`;
  }

  async loadMorePokemons() {
    this.pokemonList = [
      ...this.pokemonList,
      ...(await this.pokemonListDm.loadPokemons()),
    ];
  }
  checkEvolution(pokemon) {
    if (pokemon.evolution.chain.evolves_to.length) {
      this.dispatchEvent(
        new CustomEvent('evolves', {
          bubbles: true,
          composed: true,
          detail: pokemon,
        }),
      );
    } else {
      this.modal.showModal();
    }
  }
}
