import Fuse from '../dist/fuse';
import { BattlePokedex, PokeAliases } from './fixtures/pokedex';
import { IPokeDexAliases, PokedexType } from './fixtures/types';

const defaultOptions: Fuse.FuseOptions<PokedexType & IPokeDexAliases> = {
    keys: ['alias', 'species', 'name', 'num'],
    threshold: 0.2
};

describe('Search with typings', ()  => {
    test('When searching by number', () => {
        let aliasFuse = new Fuse(PokeAliases, defaultOptions);
        let pokeFuse = new Fuse(BattlePokedex, defaultOptions);

        const pokemon = '2';
        const firstSearch = pokeFuse.search(pokemon);
        const aliasSearch = !firstSearch.length ? aliasFuse.search(pokemon) : [];
        const pokeSearch = !firstSearch.length && aliasSearch.length ? pokeFuse.search(aliasSearch[0].name) : firstSearch;

        const poke: PokedexType = pokeSearch[0];
        const expected={num:2,species:"Ivysaur",types:["Grass","Poison"],genderRatio:{M:.875,F:.125},baseStats:{hp:60,atk:62,def:63,spa:80,spd:80,spe:60},abilities:{0:"Overgrow",H:"Chlorophyll"},heightm:1,weightkg:13,color:"Green",prevo:"bulbasaur",evos:["venusaur"],evoLevel:16,eggGroups:["Monster","Grass"]};

        expect(poke.species).toBe('Ivysaur');
        expect(poke).toMatchObject(expected);
    });

    test('When searching by alias', () => {
        let aliasFuse = new Fuse(PokeAliases, defaultOptions);
        let pokeFuse = new Fuse(BattlePokedex, defaultOptions);

        const pokemon = 'bulbapedia';
        const firstSearch = pokeFuse.search(pokemon);
        const aliasSearch = !firstSearch.length ? aliasFuse.search(pokemon) : [];
        const pokeSearch = !firstSearch.length && aliasSearch.length ? pokeFuse.search(aliasSearch[0].name) : firstSearch;

        const poke: PokedexType = pokeSearch[0];
        const expected={num:1,species:"Bulbasaur",types:["Grass","Poison"],genderRatio:{M:.875,F:.125},baseStats:{hp:45,atk:49,def:49,spa:65,spd:65,spe:45},abilities:{0:"Overgrow",H:"Chlorophyll"},heightm:.7,weightkg:6.9,color:"Green",evos:["ivysaur"],eggGroups:["Monster","Grass"]};

        expect(poke.species).toBe('Bulbasaur');
        expect(poke).toMatchObject(expected);
    });
});