import { LitElement, html } from 'lit-element';
import { getComponentSharedStyles } from '@bbva-web-components/bbva-core-lit-helpers';
import styles from './pokemon-list-ui-styles.js';

import '@bbva-web-components/bbva-core-heading/bbva-core-heading.js';
import '@bbva-web-components/bbva-button-default/bbva-button-default.js';
import '@bbva-web-components/bbva-foundations-spinner/bbva-foundations-spinner.js';
/**
 * ![LitElement component](https://img.shields.io/badge/litElement-component-blue.svg)
 *
 * This component ...
 *
 * Example:
 *
 * ```html
 *   <pokemon-list-ui></pokemon-list-ui>
 * ```
 */

export class PokemonListUi extends LitElement {
  static get properties() {
    return {
      /**
       * Description for property
       */
      pokemonList: {
        type: Array,
      },
      page: {
        type: String,
      },
      loading: {
        type: Boolean,
      },
    };
  }

  constructor() {
    super();
    this.loading = false;
    this.pokemonList = [];
    this.page = 'https://pokeapi.co/api/v2/pokemon';
    this.loadPokemons();
  }

  firstUpdated() {
    this.modal = this.shadowRoot.querySelector('dialog');
    this.spinner = this.shadowRoot.querySelector('bbva-foundations-spinner');
    console.log(this.spinner);
  }

  static get styles() {
    return [styles, getComponentSharedStyles('pokemon-list-ui-shared-styles')];
  }

  render() {
    return html`
      <bbva-core-heading level="1">Pokemon List</bbva-core-heading>

      <div class="content-container">
        <div class="list">${this._gridTpl}</div>
        ${this.loading
          ? html`<bbva-foundations-spinner
              with-mask
            ></bbva-foundations-spinner>`
          : html`<bbva-button-default @click=${(e) => this.loadPokemons()}
              >Load more pokémos</bbva-button-default
            >`}
      </div>
      <dialog class="modal">
        <div class="modal-container">
          <p>This pokemon has no evolutions</p>
          <bbva-button-default
            text="Close"
            @click=${() => this.modal.close()}
          ></bbva-button-default>
        </div>
      </dialog>
      <slot></slot>
    `;
  }

  get _gridTpl() {
    return html`<div class="list__grid">
      ${this.pokemonList.map(
        (pokemon) => html`
          <div
            class="card"
            @click=${(e) =>
              this.goToEvolutions({
                id: pokemon.id,
                name: pokemon.name,
                img: pokemon.sprites.other.home.front_default,
              })}
          >
            <img
              class="card__img"
              src="${pokemon.sprites.other.home.front_default ||
              pokemon.sprites.other['official-artwork'].front_default}"
              alt="${pokemon.name}"
              height="100"
              width="100"
            />
            <p class="card__small">no. ${pokemon.id}</p>
            <bbva-core-heading level="5"
              >${pokemon.name.toUpperCase()}</bbva-core-heading
            >
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

  async loadPokemons() {
    try {
      this.loading = true;

      const res = await fetch(this.page);
      const data = await res.json();
      this.page = data.next;

      for (const pokemon of data.results) {
        try {
          const pokemonRes = await fetch(pokemon.url);
          const pokemonData = await pokemonRes.json();

          this.pokemonList = [...this.pokemonList, pokemonData];
        } catch {
          console.error('ERROR', error);
        }
      }
    } catch (error) {
      console.error('ERROR', error);
    } finally {
      this.loading = false;
    }
  }

  async goToEvolutions(pokemonInfo) {
    const species = await this.fetchSpecies(pokemonInfo.name);
    const evolution = await this.fetchEvolutionChain(
      species.evolution_chain.url,
    );
    if (evolution.chain.evolves_to.length) {
      console.log(pokemonInfo.name, 'Tiene evolución (^o^)/');
      const selectedPokemon = {
        ...pokemonInfo,
        evolution,
      };
      console.log(selectedPokemon);
    } else {
      this.modal.showModal();
      console.log(pokemonInfo.name, 'No tiene evolución (T｡T)');
    }
  }

  async fetchSpecies(name) {
    const speciesRes = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`,
    );
    const speciesData = await speciesRes.json();
    return speciesData;
  }

  async fetchEvolutionChain(url) {
    const evolutionChainRes = await fetch(url);
    const evolutionChainData = await evolutionChainRes.json();
    return evolutionChainData;
  }
}
