addLayer('evo', {
    row: 4,
    realm: 1,
    startData() { return {
        // Basic
        unlocked: true,          // DO NOT CHANGE
        done: false,             // DO NOT CHANGE
        points: Decimal.dZero,   // Grassmasters
    }},
    update(diff) {
    },
    color: 'var(--evo)',
    layerShown() { return player.evo.done || hasMilestone('leag', 6) },
    image: 'resources/lab-icon.webp',
    nodeStyle: {
        'background-size': 'contain',
        'background-color': 'hsl(0, 0%, 27.5%)',
        'border-color': 'var(--ghop)',
    },
    effect() {
        return player.evo.points.max(1).log(4).pow(1.5);
    },
    type: 'normal',
    resource: 'Grasshoppers',
    gainMult() {
        let gain = player.hop.points.max(1).log(10).div(30).pow(0.4).pow_base(1.25).mul(100);
        gain = gain.mul(player.hop.coloTier.sub(299).pow(0.8).div(10).max(1));
        return gain.max(100).floor();
    },
    baseResource: 'Levels',
    baseAmount() { return player.hop.coloTier },
    exponent() { return Decimal.dZero },
    requires: new Decimal(299),
    passiveGeneration() {
        let gain = Decimal.dZero;
        return gain;
    },
    prestigeButtonText() {
        return player.hop.coloTier.lt(299)?`Reach Stage 300 to Evolve`:`Evolve ${formatWhole(getResetGain('evo'))} Grassmasters<br><br>Grassmasters gain is based on Grasshoppers and Stage`
    },
    tabFormat: {
        'Evolution': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters, multiplying grasshoppers gain, damage, and armour by ${format(tmp.evo.effect)}`}],
                'blank',
                'prestige-button',
                'blank',
                ['raw-html', `Evolution doesn't reset Equipment, and you keep the Forest unlocked`],
                'blank',
            ],
            color: 'var(--evo)',
        },
        'Basic Tree': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters<br><br>These upgrades have no cost scaling`}],
                'blank',
                ['clickable-tree', [
                    [11, 12, 13],
                    [21, 22],
                ]],
                'blank',
            ],
            color: 'var(--evo)',
            unlocked(){return player.evo.done},
        },
        'Advanced Tree': {
            content: [
                ['raw-html', function(){return `You have <h2  class="overlayThing" id="points" style="color: var(--evo); text-shadow: var(--evo) 0px 0px 10px;">${formatWhole(player.evo.points.max(0))}</h2> Grassmasters`}],
                'blank',
                ['clickable-tree', [
                    [201],
                    [211, 212],
                ]],
                'blank',
            ],
            color: 'var(--evo)',
            unlocked(){return player.evo.done},
        },
    },
    doReset(layer) {
        if(tmp[layer].row <= tmp[this.layer].row) { return }
        if(tmp[layer].realm != tmp[this.layer].realm && tmp[layer].realm != 0) { return }
        layerDataReset(this.layer, ['done'])
    },
    onPrestige(gain) {
        player.evo.done = true;
        activityParticle('resources/lab-icon.webp', true);
    },
    buyables: {

        // Basic Tree
        11: {
            title: 'Combatant I',
            cost(x) { return new Decimal(2) },
            effect(x) { return x.div(20).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { 
                let max = player[this.layer].points.div(2).floor().min(this.purchaseLimit.sub(getBuyableAmount(this.layer, this.id))); player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1)).mul(max)).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grasshopper DMG by +5% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(40),
            unlocked(){return true},
        },
        12: {
            title: 'Collective I',
            cost(x) { return new Decimal(3) },
            effect(x) { return x.pow_base(1.5) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.div(3).floor().min(this.purchaseLimit.sub(getBuyableAmount(this.layer, this.id))); player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1)).mul(max)).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass, EXP, and PP gain by +50% compounding per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(20),
            unlocked(){return true},
        },
        13: {
            title: 'Pointless Flower Boost',
            cost(x) { return new Decimal(10) },
            effect(x) { return x.pow_base(5) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.div(10).floor().min(this.purchaseLimit.sub(getBuyableAmount(this.layer, this.id))); player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1)).mul(max)).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(this.purchaseLimit)) },
            display() {
                return `Increases flowers gain by +400% compounding per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(2),
            unlocked(){return true},
        },
        
        21: {
            title: 'Combatant II',
            cost(x) { return new Decimal(5) },
            effect(x) { return x.div(20).add(1) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { 
                let max = player[this.layer].points.div(5).floor().min(this.purchaseLimit.sub(getBuyableAmount(this.layer, this.id))); player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1)).mul(max)).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grasshopper HP by +5% per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(60),
            unlocked(){return getBuyableAmount(this.layer, 11).gte(tmp[this.layer].buyables[11].purchaseLimit)},
            branches: [11],
        },
        22: {
            title: 'Collective II',
            cost(x) { return new Decimal(15) },
            effect(x) { return x.pow_base(1.5) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { let max = player[this.layer].points.div(15).floor().min(this.purchaseLimit.sub(getBuyableAmount(this.layer, this.id))); player[this.layer].points = player[this.layer].points.sub(this.cost(max.sub(1)).mul(max)).max(0); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(max).min(this.purchaseLimit)) },
            display() {
                return `Increases grass, EXP, PP, and TP gain by +25% compounding per level<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(40),
            unlocked(){return getBuyableAmount(this.layer, 12).gte(tmp[this.layer].buyables[12].purchaseLimit)},
            branches: [12],
        },

        // Advanced Tree
        201: {
            title: 'The Start',
            cost(x) { return new Decimal(25) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { this.buy() },
            display() {
                return `Overrides combat tick enabler if the enemy can be oneshot<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return true},
        },

        211: {
            title: 'Healthy Damage',
            cost(x) { return new Decimal(50) },
            effect() { return tmp.hop.arm.max(1).pow(0.45) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)) },
            buyMax() { this.buy() },
            display() {
                return `HP boosts DMG at a reduced rate<br><br>Currently: x${format(tmp[this.layer].buyables[this.id].effect)}<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return getBuyableAmount(this.layer, 201).gte(tmp[this.layer].buyables[201].purchaseLimit)},
            branches: [201],
        },
        212: {
            title: 'Staged',
            cost(x) { return new Decimal(150) },
            canAfford() { return player[this.layer].points.gte(tmp[this.layer].buyables[this.id].cost)&&getBuyableAmount(this.layer, this.id).lt(this.purchaseLimit)&&tmp[this.layer].buyables[this.id].unlocked },
            buy() { player[this.layer].points = player[this.layer].points.sub(tmp[this.layer].buyables[this.id].cost); setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1)); player.hop.coloTier=player.hop.coloTier.max(49) },
            buyMax() { this.buy() },
            display() {
                return `Start an evolution/league at stage 50<br>Also disables stage milestone popups<br><br>Owned: ${formatWhole(getBuyableAmount(this.layer, this.id))}/${formatWhole(this.purchaseLimit)}<br>Cost: ${formatWhole(tmp[this.layer].buyables[this.id].cost)}`
            },
            purchaseLimit: new Decimal(1),
            unlocked(){return getBuyableAmount(this.layer, 201).gte(tmp[this.layer].buyables[201].purchaseLimit)},
            branches: [201],
        },

    },
    clickables: {
        11: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        12: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        13: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        21: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        22: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },

        201: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        211: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
        212: { title() { return tmp[this.layer].buyables[this.id].title }, canClick() { return tmp[this.layer].buyables[this.id].canAfford }, onClick() { buyBuyable(this.layer, this.id) }, onHold() { buyMaxBuyable(this.layer, this.id); }, display() { return run(tmp[this.layer].buyables[this.id].display, tmp[this.layer].buyables[this.id]) }, bought(){return getBuyableAmount(this.layer, this.id).gte(tmp[this.layer].buyables[this.id].purchaseLimit)}, style: { width: '160px', height: '160px', }, unlocked() { return tmp[this.layer].buyables[this.id].unlocked }, branches() { return tmp[this.layer].buyables[this.id].branches }, },
    }
})