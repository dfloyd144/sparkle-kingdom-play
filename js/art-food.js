/* Art: healthy meals (toast, pizza, salad, soup, pasta, fruit bowl) and their toppings.
   A.dish(t) draws any food: a meal ({meal, cooked, tops}) or a baked treat ({shape, baked, frost, tops}). */
(function () {
  const A = K.art, I = A.icons;
  A.MEALS = {
    toast: { word: 'toast', tops: ['avocado', 'tomato', 'cucumber', 'cheese'], cook: false },
    pizza: { word: 'pizza', tops: ['mushroom', 'pepper', 'tomato', 'olive'], cook: true },
    salad: { word: 'salad', tops: ['tomato', 'cucumber', 'carrot', 'egg'], cook: false },
    soup: { word: 'soup', tops: ['carrot', 'peas', 'corn', 'noodle'], cook: true },
    pasta: { word: 'pasta', tops: ['meatball', 'broccoli', 'tomato', 'cheese'], cook: true },
    fruit: { word: 'fruit bowl', tops: ['strawberry', 'blueberry', 'banana', 'grape'], cook: false },
  };
  A.MEAL_ZONE = { toast: { cx: 0, cy: -50, rx: 28, ry: 22 }, pizza: { cx: 0, cy: -28, rx: 46, ry: 16 }, salad: { cx: 0, cy: -60, rx: 46, ry: 9 },
    soup: { cx: 0, cy: -54, rx: 42, ry: 7 }, pasta: { cx: 0, cy: -42, rx: 34, ry: 12 }, fruit: { cx: 0, cy: -58, rx: 44, ry: 8 } };
  A.FOOD_WORDS = {
    avocado: ['avocado', 'avocados'], tomato: ['tomato', 'tomatoes'], cucumber: ['cucumber', 'cucumbers'], cheese: ['cheese', 'cheeses'],
    mushroom: ['mushroom', 'mushrooms'], pepper: ['pepper', 'peppers'], olive: ['olive', 'olives'], carrot: ['carrot', 'carrots'],
    egg: ['egg', 'eggs'], peas: ['pea', 'peas'], corn: ['corn', 'corns'], noodle: ['noodle', 'noodles'], meatball: ['meatball', 'meatballs'],
    broccoli: ['broccoli', 'broccolis'], strawberry: ['strawberry', 'strawberries'], blueberry: ['blueberry', 'blueberries'],
    banana: ['banana', 'bananas'], grape: ['grape', 'grapes'], cherry: ['cherry', 'cherries'], sprinkles: ['sprinkle', 'sprinkles'],
    heart: ['heart', 'hearts'], star: ['star', 'stars'],
  };
  const T = {
    avocado: '<ellipse rx="10" ry="8" fill="#b6e07a" stroke="#6aa84f" stroke-width="2"/><circle r="3.5" fill="#a0703a"/>',
    tomato: '<circle r="9" fill="#ff5a5a" stroke="#d93e3e" stroke-width="1.5"/><circle r="5" fill="#ff8a8a"/><circle r="1.5" fill="#fff4b8"/>',
    cucumber: '<circle r="9" fill="#d8f2c8" stroke="#4f9a4f" stroke-width="2.5"/><circle r="3" fill="#a6d690"/>',
    cheese: '<path d="M-10 6 L10 6 L-1 -10Z" fill="#ffd166" stroke="#e6a52e" stroke-width="1.5" stroke-linejoin="round"/><circle cx="0" cy="1" r="2" fill="#e6a52e"/>',
    mushroom: '<path d="M-10 0 Q-10 -12 0 -12 Q10 -12 10 0Z" fill="#c9a07a" stroke="#a0784f" stroke-width="1.5"/><rect x="-3" y="-1" width="6" height="8" rx="2" fill="#f2e6d6"/>',
    pepper: '<path d="M-8 -6 Q0 -12 8 -6 Q12 4 0 8 Q-12 4 -8 -6Z" fill="none" stroke="#3fa66a" stroke-width="4"/>',
    olive: '<circle r="7" fill="none" stroke="#3a2a3a" stroke-width="4"/>',
    carrot: '<circle r="8" fill="#ffad5a" stroke="#e8803f" stroke-width="2"/><circle r="3" fill="#ffc98a"/>',
    egg: '<ellipse rx="10" ry="8" fill="#fff" stroke="#e8dcf0" stroke-width="1.5"/><circle r="4.5" fill="#ffd166"/>',
    peas: '<circle cx="-5" cy="2" r="4.5" fill="#7fd06a"/><circle cx="4" cy="3" r="4.5" fill="#6ac05a"/><circle cx="0" cy="-5" r="4.5" fill="#8fd88f"/>',
    corn: '<rect x="-8" y="-4" width="7" height="7" rx="2" fill="#ffe27f"/><rect x="1" y="-2" width="7" height="7" rx="2" fill="#ffd166"/><rect x="-3" y="-9" width="7" height="7" rx="2" fill="#ffe9a0"/>',
    noodle: '<path d="M-12 0 Q-6 -8 0 0 Q6 8 12 0" fill="none" stroke="#ffe08a" stroke-width="4" stroke-linecap="round"/>',
    meatball: '<circle r="9" fill="#a0603a" stroke="#7a4428" stroke-width="2"/><circle cx="-3" cy="-3" r="2" fill="#c98a5a"/>',
    broccoli: '<rect x="-2.5" y="0" width="5" height="9" rx="2" fill="#8fd88f"/><circle cx="-5" cy="-3" r="5.5" fill="#3fa66a"/><circle cx="5" cy="-3" r="5.5" fill="#3fa66a"/><circle cx="0" cy="-8" r="5.5" fill="#4fb878"/>',
    blueberry: '<circle r="7" fill="#5a6ed6"/><circle cx="-2" cy="-2" r="2" fill="#9aa8f0"/>',
    banana: '<circle r="8" fill="#fff4b8" stroke="#e6c34a" stroke-width="2"/><circle r="2" fill="#c9a07a"/>',
    grape: '<ellipse rx="6.5" ry="8" fill="#9a5ac9"/><ellipse cx="-2" cy="-3" rx="2" ry="2.5" fill="#c9a0f0"/>',
  };
  const oldTopping = A.topping;
  A.topping = (k, rot = 0) => (T[k] ? `<g transform="rotate(${rot})">${T[k]}</g>` : oldTopping(k, rot));

  const plate = '<ellipse cx="0" cy="2" rx="82" ry="12" fill="#fff" stroke="#e8d8f0" stroke-width="3"/>';
  const bowl = (c, s) => `<path d="M-70 -52 Q-66 2 0 6 Q66 2 70 -52Z" fill="${c}" stroke="${s}" stroke-width="3"/><path d="M-60 -24 Q0 -10 60 -24" stroke="#fff" stroke-width="4" fill="none" opacity=".5"/>`;
  const steam = '<g class="float" opacity=".8"><path d="M-14 -80 q-8 -12 0 -24 M6 -84 q-8 -12 0 -24" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>';
  A.meal = (t) => {
    let s = '';
    switch (t.meal) {
      case 'toast': s = `${plate}<path d="M-46 -4 V-56 Q-46 -78 -26 -80 Q-20 -96 0 -96 Q20 -96 26 -80 Q46 -78 46 -56 V-4Z" fill="#e8b878" stroke="#c98d56" stroke-width="3"/>
        <path d="M-37 -10 V-54 Q-37 -70 -22 -72 Q-17 -85 0 -85 Q17 -85 22 -72 Q37 -70 37 -54 V-10Z" fill="#f7deb0"/>`; break;
      case 'pizza': s = `${plate}<ellipse cy="-26" rx="74" ry="32" fill="${t.cooked ? '#e9b06a' : '#f6dcae'}" stroke="#c98d56" stroke-width="3"/>
        <ellipse cy="-28" rx="62" ry="25" fill="#e8553f"/><ellipse cy="-28" rx="55" ry="21" fill="${t.cooked ? '#ffd166' : '#fff2c2'}" opacity=".9"/>`; break;
      case 'salad': s = `${bowl('#9fd2ff', '#5aa7d8')}<ellipse cy="-54" rx="70" ry="15" fill="#8fd88f"/>
        ${[-46, -24, 0, 24, 46].map((x, i) => `<ellipse cx="${x}" cy="${-58 - (i % 2) * 6}" rx="16" ry="10" fill="${i % 2 ? '#6ac05a' : '#a6e07a'}"/>`).join('')}`; break;
      case 'soup': s = `${bowl('#ffd1e8', '#e57aa8')}<ellipse cy="-52" rx="66" ry="13" fill="${t.cooked ? '#ffb86b' : '#ffd9b0'}"/>${t.cooked ? steam : ''}`; break;
      case 'pasta': s = `${plate}<path d="M-62 -6 Q-58 -62 0 -64 Q58 -62 62 -6Z" fill="${t.cooked ? '#ffe08a' : '#fff1c2'}" stroke="#e6b84a" stroke-width="3"/>
        <path d="M-44 -20 Q-30 -40 -16 -20 Q-2 -40 12 -20 Q26 -40 40 -20 M-36 -38 Q-20 -54 -4 -38 Q12 -54 28 -38" stroke="#e6b84a" stroke-width="3" fill="none"/>
        ${t.cooked ? '<ellipse cy="-46" rx="30" ry="9" fill="#e8553f" opacity=".85"/>' + steam : ''}`; break;
      case 'fruit': s = `${bowl('#ffc2dc', '#e57aa8')}<ellipse cy="-52" rx="66" ry="13" fill="#fffaf2" stroke="#f0e6ec" stroke-width="2"/>`; break;
    }
    (t.tops || []).forEach((p) => { s += `<g transform="translate(${p.x} ${p.y}) scale(1.3)">${A.topping(p.k, p.r)}</g>`; });
    return s;
  };
  A.dish = (t) => (t && t.meal ? A.meal(t) : A.treat(t));
  A.dishWord = (t) => (t.meal ? A.MEALS[t.meal].word : ['cupcake', 'cookie', 'cake'][t.shape]);
  I.pot = `<path d="M-30 -8 H30 V18 Q30 30 18 30 H-18 Q-30 30 -30 18Z" fill="#c9a6ff" stroke="#9a7fe0" stroke-width="3"/><rect x="-34" y="-14" width="68" height="10" rx="5" fill="#b393f2" stroke="#9a7fe0" stroke-width="2.5"/>
    <path d="M-30 0 H-40 M30 0 H40" stroke="#9a7fe0" stroke-width="5" stroke-linecap="round"/><path d="M-10 -22 q-6 -8 0 -16 M8 -22 q-6 -8 0 -16" stroke="#ff9ec7" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <circle cx="-14" cy="-4" r="0" /><path d="${A.heart(0.7)}" transform="translate(0 12)" fill="#fff"/>`;
})();
