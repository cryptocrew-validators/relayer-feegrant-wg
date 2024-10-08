# IBC Relayer Feegrant Working Group

This repository is the implementation of [Cosmoshub Proposal #862](https://www.mintscan.io/cosmos/proposals/862): Cosmos Hub IBC Relayer gas cost restitution using FeeGrants

It hosts automation to maintain IBC Relayer `feegrant` allowances by a multisig account.

## Onboarding steps
- Add your operator account to all official paths that you relay on. You can either do this by completing a new [onboarding issue](https://github.com/cryptocrew-validators/relayer-feegrant-wg/issues/new?assignees=&labels=operator-onboarding&projects=&template=operator_onboarding.md&title=Operator+Onboarding%3A+%5BYour+Name%5D) or by [directly opening a PR](https://github.com/cryptocrew-validators/relayer-feegrant-wg/compare)
- Upon submission, your PR will be reviewed by the maintainers of this repository.
- Grants and period spend limits (daily spend limits) are frequently evaluated. The current review schedule of the Governance Committee is bi-weekly.
- Upon issuance of the `feegrant` allowance, your `Active Period Spend Limit` will show the active daily spend limit granted for your account.
- Please frequently review the [Operators Table](#operators) below to stay informed about your allowance status and spend limit.

## Relayer Tier system

| Tier | Period Spend Limit | Evaluation criteria |
| ---- | ------------------ | ------------------- |
| `Tier 1` | 50 ATOM | Top 10 accounts by effected packets confirmed during the past 30d |
| `Tier 2` | 5 ATOM | All other accounts |

## Governance Committee & Monitoring Framework

The Governance Committee, composed of feegrant multisig members, holds the authority to review and withdraw whitelisting privileges on a regular basis. Additionally, this committee is empowered to assess and modify the onboarding guidelines as necessary. Reasons for revocation include, but are not limited to: excessive or inappropriate transactions (spamming), non-compliance with onboarding standards (such as batch delay and efficiency), utilization of feegrants for purposes unrelated to IBC, and exploitation of any inadvertent misconfigurations by the multisig.

The Governance Committee consists of:

- Clemens (CryptoCrew): `cosmos1705swa2kgn9pvancafzl254f63a3jda9ngdnc7`
- Ghazni (StakeCito): `cosmos1qm5agp78atuf9pyalsq4w30mzc3lxtj0vgq2qe`
- luisqa (Interbloc): `cosmos1ze09kc5ackut7wc4pf38lysu45kfz3ms86w3em`
- tricky (CosmosSpaces): `cosmos1a8x3fn37gjnglcr25fsfyr6c5m4ed5euwvae2n`
- Ertemann (Lavender.Five Nodes): `cosmos1xfl6qve3plepgk7wlgxypem5ngntavrnkng3vz`

**Feegrant Multisig Address:** `cosmos14r8ff03jkyac2fukjtfrfgaj8ehjlhds5ec2zp`

## Regulatory framework for participating Relayers 

The following rules for relayer operation using this `feegrant` have been identified by the Governance Committee:

- Relayers must use the globally defined minimum gas price of `0.005uatom`.
- Relayers must set `batch_delay` to a minimum of `1000ms` to prevent overspending.
- Relayers must use private / single-tenancy RPC/gRPC infrastructure.
- Relayers must only use the `feegrant` allowance to broadcast IBC-relaying related message types (type urls beginning with `/ibc`). If relayers use the allowance for any other message type they will be warned upon the first instance, and disqualified at the 2nd instance of misbehavior.

Failing to comply with any of the above rules will lead to disqualification of the Relayer Operator and revocation of all issued `feegrant` allowances corresponding to that Relayer Operator.

### Example configuration for [Hermes Relayer](https://hermes.informal.systems)

```toml
[[chains]]
id = 'cosmoshub-4'
fee_granter = 'cosmos14r8ff03jkyac2fukjtfrfgaj8ehjlhds5ec2zp'
event_source = { mode = 'push', url = '<YOUR-WS-URL>', batch_delay = '1000ms' }
rpc_addr = '<YOUR-RPC-URL>'
grpc_addr = '<YOUR-GRPC-URL>'
rpc_timeout = '10s'
account_prefix = 'cosmos'
key_name = 'default'
address_type = { derivation = 'cosmos' }
store_prefix = 'ibc'
default_gas = 2000000
max_gas = 9000000
gas_price = { price = 0.005, denom = 'uatom' }
gas_multiplier = 1.1
max_msg_num = 25
query_packets_chunk_size = 25
max_tx_size = 180000
clock_drift = '15s'
max_block_time = '10s'
trusting_period = '336h'
memo_prefix = '<YOUR-MEMO>'
trust_threshold = '2/3'
client_refresh_rate = '1/30'
[chains.packet_filter]
policy = 'allow'
list = [
# ['transfer', 'channel-141'], # osmosis-1 transfer
] 
```

## Operators

| Name | Address | Total Paths | Discord | Telegram | Period Spend Limit | Active Period Spend Limit |
|------|---------|-------------|---------|----------|--------------------|---------------------------|
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | 13 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | 13 | [`ghostdotexe`](https://discordapp.com/users/ghostdotexe) | [`gh0stdotexe`](https://t.me/gh0stdotexe) | 50.0 | 50.0 |
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | 11 | [`.tricky_.`](https://discordapp.com/users/.tricky_.) | [`Char1esBark1ey`](https://t.me/Char1esBark1ey) | 50.0 | 50.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | 11 | [`subzero0057`](https://discordapp.com/users/subzero0057) | [`alagiz`](https://t.me/alagiz) | 50.0 | 50.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | 8 | [`jovegatadao`](https://discordapp.com/users/jovegatadao) | [`jovecosmos`](https://t.me/jovecosmos) | 0.0 | 0.0 |
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | 7 | [`galadrin_crosnest`](https://discordapp.com/users/galadrin_crosnest) | [`crosnest_com`](https://t.me/crosnest_com) | 50.0 | 50.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | 7 | [`architectnodes`](https://discordapp.com/users/architectnodes) | [`social244305_Architect_Nodes`](https://t.me/social244305_Architect_Nodes) | 50.0 | 50.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | 7 | [`goldenstaking`](https://discordapp.com/users/goldenstaking) | [`fibstaking`](https://t.me/fibstaking) | 0.0 | 0.0 |
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | 6 | [`galadrin_crosnest`](https://discordapp.com/users/galadrin_crosnest) | [`crosnest_com`](https://t.me/crosnest_com) | 50.0 | 50.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | 6 | [`stan_bluestake`](https://discordapp.com/users/stan_bluestake) | [``](https://t.me/) | 0.0 | 0.0 |
| Crosnest | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | 5 | [`galadrin_crosnest`](https://discordapp.com/users/galadrin_crosnest) | [`crosnest_com`](https://t.me/crosnest_com) | 50.0 | 50.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | 5 | [`.pfc`](https://discordapp.com/users/.pfc) | [`pfc_validator`](https://t.me/pfc_validator) | 50.0 | 50.0 |
| Inter Blockchain Services | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | 5 | [`remiinterblockchainservices`](https://discordapp.com/users/remiinterblockchainservices) | [`remiibs`](https://t.me/remiibs) | 50.0 | 50.0 |
| IcyCRO | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | 4 | [`zanglang`](https://discordapp.com/users/zanglang) | [`zanglang`](https://t.me/zanglang) | 50.0 | 50.0 |
| IcyCRO | `cosmos1p7d8mnjttcszv34pk2a5yyug3474mhffasa7tg` | 3 | [`zanglang`](https://discordapp.com/users/zanglang) | [`zanglang`](https://t.me/zanglang) | 50.0 | 50.0 |
| Decentrio | `cosmos1w0f29w3hst8hzhr2cv30cfjvqp70yyp9wgr3pv` | 3 | [`dunguyen29`](https://discordapp.com/users/dunguyen29) | [`dunguyen_29`](https://t.me/dunguyen_29) | 50.0 | 50.0 |
| Inter Blockchain Services | `cosmos1evdjzy3w9t2yu54w4dhc2cvrlc2fvnpts7qstc` | 3 | [`remiinterblockchainservices`](https://discordapp.com/users/remiinterblockchainservices) | [`remiibs`](https://t.me/remiibs) | 50.0 | 50.0 |
| Cypher Core | `cosmos12alkl0egcpjnacj7kcx7svuy4u9nvf0s5sx8nf` | 3 | [`pepeforlife`](https://discordapp.com/users/pepeforlife) | [`jim380`](https://t.me/jim380) | 50.0 | 50.0 |
| Cosmos Spaces | `cosmos1558hpgzv2jt6rkuccaklxhgtj8mcleq0s2zcsl` | 2 | [`.tricky_.`](https://discordapp.com/users/.tricky_.) | [`Char1esBark1ey`](https://t.me/Char1esBark1ey) | 50.0 | 50.0 |
| Architect Nodes | `cosmos1w8kzcqk25vr0fx0k7yxn2vjw49qerut2tfv8up` | 2 | [`architectnodes`](https://discordapp.com/users/architectnodes) | [`social244305_Architect_Nodes`](https://t.me/social244305_Architect_Nodes) | 50.0 | 50.0 |
| Inter Blockchain Services | `cosmos14uyfxlv00lj0qhcwt7vms2rsf7kxuld75qcj6u` | 2 | [`remiinterblockchainservices`](https://discordapp.com/users/remiinterblockchainservices) | [`remiibs`](https://t.me/remiibs) | 50.0 | 50.0 |
| CryptoCrew | `cosmos1f269n4mrg0s8tqveny9huulyamvdv97n094dgm` | 1 | [`ccclaimens`](https://discordapp.com/users/ccclaimens) | [`clemensg`](https://t.me/clemensg) | 50.0 | 50.0 |
| Cosmos Spaces | `cosmos1kgs9ml9hc085k6pm36z6wlnjc3c8zv99myau2w` | 1 | [`.tricky_.`](https://discordapp.com/users/.tricky_.) | [`Char1esBark1ey`](https://t.me/Char1esBark1ey) | 50.0 | 50.0 |
| Architect Nodes | `cosmos1ln3l6waaqdjcskt3ztzqlzkpvmzp7zw4ky2xgp` | 1 | [`architectnodes`](https://discordapp.com/users/architectnodes) | [`social244305_Architect_Nodes`](https://t.me/social244305_Architect_Nodes) | 50.0 | 50.0 |
| CryptoCrew | `cosmos1yghndrffay859ma2ue4pa2cltw640vtayerdla` | 1 | [`@ccclaimens`](https://discordapp.com/users/@ccclaimens) | [`@clemensg`](https://t.me/@clemensg) | 50.0 | 50.0 |
| Cosmos Spaces | `cosmos126pkrcvytfvsvrdm7x4wme5y780amvwwarzezc` | 1 | [`.tricky_.`](https://discordapp.com/users/.tricky_.) | [`Char1esBark1ey`](https://t.me/Char1esBark1ey) | 50.0 | 50.0 |
| Decentrio | `cosmos1sk76c20mkypkm8mmrza09nnkq9vkqn4atn60qj` | 1 | [`dunguyen29`](https://discordapp.com/users/dunguyen29) | [`dunguyen_29`](https://t.me/dunguyen_29) | 50.0 | 50.0 |
| Cosmonaut Stakes | `cosmos1ujwsewqwndsyyzt0ujevhr4uxrsd574m8f7l78` | 1 | [`danoly`](https://discordapp.com/users/danoly) | [`CosmonautStakes`](https://t.me/CosmonautStakes) | 50.0 | 50.0 |
| 🐹 Quokka Stake | `cosmos17ndx5qfku28ymxgmq6zq4a6d02dvpfjj5yu8j9` | 1 | [`@freak12techno`](https://discordapp.com/users/@freak12techno) | [`@freak12techno`](https://t.me/@freak12techno) | 50.0 | 50.0 |
| Inter Blockchain Services | `cosmos156vfr4kpaa0f07y673awf3u87eeemygldsjwu5` | 1 | [`remiinterblockchainservices`](https://discordapp.com/users/remiinterblockchainservices) | [`remiibs`](https://t.me/remiibs) | 50.0 | 50.0 |
| Lavender.Five Nodes | `cosmos1ure9g8re7h3qpk7d976e6t8yf4l9lz2etv3dh2` | 1 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| Lavender.Five Nodes | `cosmos159rufrfkf5g8qld5zqlsejesr4mlnfx0jkhj2f` | 1 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| Lavender.Five Nodes | `cosmos1j6swju2q7zywxmpcttcw4k98j7fphx5n5wrgyk` | 1 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| Lavender.Five Nodes | `cosmos1aypuqvaaq54jn3zleqd6lamnxruun5neplwq20` | 1 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| Lavender.Five Nodes | `cosmos1nzjcsulyfxh0evmajk3ruawh407h5x8fse7tcy` | 1 | [`dylanschultzie`](https://discordapp.com/users/dylanschultzie) | [`dylanschultzie`](https://t.me/dylanschultzie) | 50.0 | 50.0 |
| ValiDAO | `cosmos16p6lrlxf7f03c0ka8cv4sznr29rym27up5d9kh` | 1 | [`murakamikaze`](https://discordapp.com/users/murakamikaze) | [`murakamikaze`](https://t.me/murakamikaze) | 0.0 | 0.0 |
| CroutonDigital | `cosmos1m7t70kzzmnax04jwcdu38rjljtaj8cl4clz6zq` | 1 | [`ak32821`](https://discordapp.com/users/ak32821) | [`toxa3333`](https://t.me/toxa3333) | 0.0 | 0.0 |
| R93ax | `cosmos1h36h57805m7eann0xs2mrv72p8wnyypm50uqce` | 1 | [`r93axcosmosspaces`](https://discordapp.com/users/r93axcosmosspaces) | [`r93ax`](https://t.me/r93ax) | 0.0 | 0.0 |

## Paths

<details><summary>akash-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `akash1ks0qeq9vyt9l7vgasaajd49ff0k8klur5p59vf` | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | 0.0 | 0.0 |
| Lavender.Five Nodes | `akash18xrruhq5r246mwk0yj9elnn3mte8xa9udwk24x` | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | 0.0 | 0.0 |
| cosmosrescue | `akash1p4557mdpc2qk8vcemeqgrcg55gs2uyznfd6276` | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | 0.0 | 0.0 |
| Cosmonaut Stakes | `akash12396w3rxfpe349h7vdhs4e35y4xqq7rxjfnznt` | `cosmos1ujwsewqwndsyyzt0ujevhr4uxrsd574m8f7l78` | 0.0 | 0.0 |
| WhisperNode | `akash1ryq6zncdxpdnnwhn9h24ar48ap9zkqgl5xpdnk` | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | 0.0 | 0.0 |
| GATA HUB | `akash182ydqc6grkqyuxqmte4dh40jw4sw32jx2x7dyz` | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | 0.0 | 0.0 |
</details>

<details><summary>archway-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `archway1l267dmlmprhu4p5aqslf50f495vjqlg3glkqcu` | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | 0.0 | 0.0 |
| Lavender.Five Nodes | `archway18xrruhq5r246mwk0yj9elnn3mte8xa9u478fxt` | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | 0.0 | 0.0 |
| WhisperNode | `archway1ryq6zncdxpdnnwhn9h24ar48ap9zkqglvkswqm` | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | 0.0 | 0.0 |
| GATA HUB | `archway1k8kq4292fdl6n4v5nu6fh7zm9zak7ffv6r3qld` | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | 0.0 | 0.0 |
</details>

<details><summary>aura-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `aura19pjtx7dah2fquf7udyxjv94h0eraha787qxuts` | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | 0.0 | 0.0 |
| Lavender.Five Nodes | `aura18xrruhq5r246mwk0yj9elnn3mte8xa9umrv0w9` | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | 0.0 | 0.0 |
</details>

<details><summary>axelar-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `axelar1558hpgzv2jt6rkuccaklxhgtj8mcleq05y5sm7` | `cosmos1558hpgzv2jt6rkuccaklxhgtj8mcleq0s2zcsl` | 0.0 | 0.0 |
| Crosnest | `axelar19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqzxn3p9` | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | 0.0 | 0.0 |
| IcyCRO | `axelar1nna7k5lywn99cd63elcfqm6p8c5c4qcuvmt3z4` | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | 0.0 | 0.0 |
| cosmosrescue | `axelar1p4557mdpc2qk8vcemeqgrcg55gs2uyznqcp9vp` | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | 0.0 | 0.0 |
| WhisperNode | `axelar1ryq6zncdxpdnnwhn9h24ar48ap9zkqglan6zpd` | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | 0.0 | 0.0 |
| Inter Blockchain Services | `axelar14uyfxlv00lj0qhcwt7vms2rsf7kxuld7sww63a` | `cosmos14uyfxlv00lj0qhcwt7vms2rsf7kxuld75qcj6u` | 0.0 | 0.0 |
</details>

<details><summary>bitcanna-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Inter Blockchain Services | `bcna1evdjzy3w9t2yu54w4dhc2cvrlc2fvnpt2ws3r2` | `cosmos1evdjzy3w9t2yu54w4dhc2cvrlc2fvnpts7qstc` | 0.0 | 0.0 |
</details>

<details><summary>bitsong-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Architect Nodes | `bitsong16arskkjeeq9jnvwfe78n8m9y06jkj9kp2vc6vn` | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | 0.0 | 0.0 |
</details>

<details><summary>carbon-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Lavender.Five Nodes | `swth18xrruhq5r246mwk0yj9elnn3mte8xa9ult3ml9` | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | 0.0 | 0.0 |
</details>

<details><summary>composable-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `centauri1ks0qeq9vyt9l7vgasaajd49ff0k8kluras573q` | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | 0.0 | 0.0 |
| WhisperNode | `centauri1ryq6zncdxpdnnwhn9h24ar48ap9zkqglahpkwl` | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | 0.0 | 0.0 |
</details>

<details><summary>coreum-cosmoshub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Inter Blockchain Services | `core14uyfxlv00lj0qhcwt7vms2rsf7kxuld78wqfa8` | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | 0.0 | 0.0 |
| CroutonDigital | `core1yzwae8sy5pxe3pkdwh9prnj0ump90yg4x2eyfk` | `cosmos1m7t70kzzmnax04jwcdu38rjljtaj8cl4clz6zq` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-crescent</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `cre1ks0qeq9vyt9l7vgasaajd49ff0k8kluraj28q7` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1w8kzcqk25vr0fx0k7yxn2vjw49qerut2tfv8up` | `cre1cx82d7pm4dgffy7a93rl6ul5g84vjgxkrw4xxp` | 0.0 | 0.0 |
| IcyCRO | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | `cre1nna7k5lywn99cd63elcfqm6p8c5c4qcuvawuue` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-cryptoorgchain</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | `cro19kzuzfmmy9wjr3cl0ss8wjzjup9g49hq7ndqk4` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-dymension</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Inter Blockchain Services | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | `dym1yp9cvg8rncfh07xcsmafte6jf860qq5vlwp32t` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-emoney</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | `emoney19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqftldae` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-empowerchain</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `empower1ryq6zncdxpdnnwhn9h24ar48ap9zkqgl93gpsj` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-evmos</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `evmos146sl9u5kgsa86mxk6zjhmwlnlxa7l7cwyvlhan` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `evmos1tusg5d35w03v0s2u5tefvf5yclguye09ctw6zu` | 0.0 | 0.0 |
| IcyCRO | `cosmos1p7d8mnjttcszv34pk2a5yyug3474mhffasa7tg` | `evmos1lldjhjnn32e8vek7cxe9g05nf8j74y0xa6dt3p` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-impacthub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Inter Blockchain Services | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | `ixo14uyfxlv00lj0qhcwt7vms2rsf7kxuld7t4xq70` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-injective</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `inj146sl9u5kgsa86mxk6zjhmwlnlxa7l7cwvyea4r` | 0.0 | 0.0 |
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `inj1lagtgtck8627009uw39rlmsa6ty5dhwwuujq3m` | 0.0 | 0.0 |
| Decentrio | `cosmos1w0f29w3hst8hzhr2cv30cfjvqp70yyp9wgr3pv` | `inj1n2wzhz0zvrpzjvwfjva6shq0lxyy0d8atf4f5f` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `inj1mx070d26eu5trde862pfl6gaqmzlcj99udwy02` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `inj1w29rwsjjpcmen347qdugjfusun4xshq6zfc6gj` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `inj1jszj9xyh2eh8lx25u88rsv7hmsytvwsvr6cne0` | 0.0 | 0.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | `inj12qsz2ks3c88knmdg70naeu8xap6reeex9vyjg6` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `inj15wvxn0lvg7zf942h8rt3zqw2qgm3h3g0lm9rnp` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-juno</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `juno1ks0qeq9vyt9l7vgasaajd49ff0k8klur0g6ej0` | 0.0 | 0.0 |
| Crosnest | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | `juno19pjtx7dah2fquf7udyxjv94h0eraha78nyj9w4` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1w8kzcqk25vr0fx0k7yxn2vjw49qerut2tfv8up` | `juno1w8kzcqk25vr0fx0k7yxn2vjw49qerut2am0uma` | 0.0 | 0.0 |
| IcyCRO | `cosmos1p7d8mnjttcszv34pk2a5yyug3474mhffasa7tg` | `juno1nna7k5lywn99cd63elcfqm6p8c5c4qcu787zwg` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `juno1p4557mdpc2qk8vcemeqgrcg55gs2uyznjy5kqu` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `juno1ryq6zncdxpdnnwhn9h24ar48ap9zkqgl0003ds` | 0.0 | 0.0 |
| Cypher Core | `cosmos12alkl0egcpjnacj7kcx7svuy4u9nvf0s5sx8nf` | `juno1yv2myphganx8evm3z6s8rstwnd468c8cf36mg4` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `juno1kqmzy5gph45f57hqdlchqsktk82ntmsxlen2j6` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `juno1n6j7gnld9yxfyh6tflxhjjmt404zruualvjsgm` | 0.0 | 0.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `juno1x8xujz36hgmg27c6x87vxy4pzs5s45ecydfsqx` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-kava</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | `kava19pjtx7dah2fquf7udyxjv94h0eraha78er9rlw` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `kava1k9jg0f6rtp6vengjjnzd27plvygsr9r0wuu0qt` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos1evdjzy3w9t2yu54w4dhc2cvrlc2fvnpts7qstc` | `kava1evdjzy3w9t2yu54w4dhc2cvrlc2fvnptvt5dal` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-kichain</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | `ki19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqh95kws` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos1evdjzy3w9t2yu54w4dhc2cvrlc2fvnpts7qstc` | `ki1evdjzy3w9t2yu54w4dhc2cvrlc2fvnptpn3l0v` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-kujira</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1558hpgzv2jt6rkuccaklxhgtj8mcleq0s2zcsl` | `kujira1558hpgzv2jt6rkuccaklxhgtj8mcleq0pzqqa4` | 0.0 | 0.0 |
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `kujira1l267dmlmprhu4p5aqslf50f495vjqlg3vugulp` | 0.0 | 0.0 |
| IcyCRO | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | `kujira1nna7k5lywn99cd63elcfqm6p8c5c4qcuealpy7` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `kujira18xrruhq5r246mwk0yj9elnn3mte8xa9u3ae4pk` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `kujira1p4557mdpc2qk8vcemeqgrcg55gs2uyzn474422` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `kujira1ryq6zncdxpdnnwhn9h24ar48ap9zkqglg4wj8x` | 0.0 | 0.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | `kujira1wqp8yslqh2mdvxzgljsde8wu6nyjp4qy8u6qra` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | `kujira1evdjzy3w9t2yu54w4dhc2cvrlc2fvnptpkzgxj` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `kujira1n6j7gnld9yxfyh6tflxhjjmt404zruuacknnzd` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-lumnetwork</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | `lum19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqnzcsls` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-neutron</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `neutron1ks0qeq9vyt9l7vgasaajd49ff0k8klura9sq05` | 0.0 | 0.0 |
| IcyCRO | `cosmos1nna7k5lywn99cd63elcfqm6p8c5c4qcug4aef5` | `neutron1nna7k5lywn99cd63elcfqm6p8c5c4qcuv25mnn` | 0.0 | 0.0 |
| CryptoCrew | `cosmos1yghndrffay859ma2ue4pa2cltw640vtayerdla` | `neutron1yghndrffay859ma2ue4pa2cltw640vtaqx2096` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `neutron1p4557mdpc2qk8vcemeqgrcg55gs2uyznqf70a8` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `neutron1ryq6zncdxpdnnwhn9h24ar48ap9zkqglaz9gst` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `neutron1uyv59p94h6g9ta2xucrphpu2l5ydce0h5lt7z0` | 0.0 | 0.0 |
| R93ax | `cosmos1h36h57805m7eann0xs2mrv72p8wnyypm50uqce` | `neutron1h36h57805m7eann0xs2mrv72p8wnyypmss4zz7` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `neutron1n6j7gnld9yxfyh6tflxhjjmt404zruuadpcf4q` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-noble</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `noble1ks0qeq9vyt9l7vgasaajd49ff0k8klur3ev2da` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `noble18xrruhq5r246mwk0yj9elnn3mte8xa9ugkw95j` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `noble1p4557mdpc2qk8vcemeqgrcg55gs2uyznv4z9lw` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `noble1n6j7gnld9yxfyh6tflxhjjmt404zruuapayrhf` | 0.0 | 0.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `noble1x8xujz36hgmg27c6x87vxy4pzs5s45ec6ulrl5` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-omniflixhub</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqxg9e2y` | `omniflix19kzuzfmmy9wjr3cl0ss8wjzjup9g49hqmk5qa6` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `omniflix1cx82d7pm4dgffy7a93rl6ul5g84vjgxk6ch6yj` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `omniflix18xrruhq5r246mwk0yj9elnn3mte8xa9uat25mz` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `omniflix1tfa6axplvpt0ucsur4zv56a5gq8x6x0nr5z3qa` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-osmosis</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| CryptoCrew | `cosmos1f269n4mrg0s8tqveny9huulyamvdv97n094dgm` | `osmo1f269n4mrg0s8tqveny9huulyamvdv97n87xa7f` | 0.0 | 0.0 |
| Cosmos Spaces | `cosmos1kgs9ml9hc085k6pm36z6wlnjc3c8zv99myau2w` | `osmo1kgs9ml9hc085k6pm36z6wlnjc3c8zv99nlwvuu` | 0.0 | 0.0 |
| Crosnest | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | `osmo19pjtx7dah2fquf7udyxjv94h0eraha78ddzwlm` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `osmo1cx82d7pm4dgffy7a93rl6ul5g84vjgxk0a4n97` | 0.0 | 0.0 |
| Decentrio | `cosmos1w0f29w3hst8hzhr2cv30cfjvqp70yyp9wgr3pv` | `osmo1w0f29w3hst8hzhr2cv30cfjvqp70yyp9xnsph7` | 0.0 | 0.0 |
| Decentrio | `cosmos1sk76c20mkypkm8mmrza09nnkq9vkqn4atn60qj` | `osmo1sk76c20mkypkm8mmrza09nnkq9vkqn4argflkq` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `osmo1p4557mdpc2qk8vcemeqgrcg55gs2uyznvdya3j` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `osmo1ryq6zncdxpdnnwhn9h24ar48ap9zkqgl3xl6u7` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos156vfr4kpaa0f07y673awf3u87eeemygldsjwu5` | `osmo156vfr4kpaa0f07y673awf3u87eeemygl9tp72x` | 0.0 | 0.0 |
| Cypher Core | `cosmos12alkl0egcpjnacj7kcx7svuy4u9nvf0s5sx8nf` | `osmo1clpawdm0dkyjsz5ed48ch3cv5z7d40gu09jta3` | 0.0 | 0.0 |
| 🐹 Quokka Stake | `cosmos17ndx5qfku28ymxgmq6zq4a6d02dvpfjj5yu8j9` | `osmo17ndx5qfku28ymxgmq6zq4a6d02dvpfjjul0hyh` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos1ure9g8re7h3qpk7d976e6t8yf4l9lz2etv3dh2` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos159rufrfkf5g8qld5zqlsejesr4mlnfx0jkhj2f` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos1j6swju2q7zywxmpcttcw4k98j7fphx5n5wrgyk` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos1aypuqvaaq54jn3zleqd6lamnxruun5neplwq20` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos1nzjcsulyfxh0evmajk3ruawh407h5x8fse7tcy` | `osmo18xrruhq5r246mwk0yj9elnn3mte8xa9ugwga6w` | 0.0 | 0.0 |
| ValiDAO | `cosmos16p6lrlxf7f03c0ka8cv4sznr29rym27up5d9kh` | `osmo16p6lrlxf7f03c0ka8cv4sznr29rym27uf074q9` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `osmo129k9pj8yk58278q8l6j00azdxfjvz93kp37pak` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `osmo1n6j7gnld9yxfyh6tflxhjjmt404zruuap9zme4` | 0.0 | 0.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `osmo1x8xujz36hgmg27c6x87vxy4pzs5s45ec6yem3g` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-persistence</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `persistence1l267dmlmprhu4p5aqslf50f495vjqlg3ncvhu0` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `persistence1cx82d7pm4dgffy7a93rl6ul5g84vjgxkf2qsag` | 0.0 | 0.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `persistence1x8xujz36hgmg27c6x87vxy4pzs5s45ecunvcf7` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-quicksilver</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `quick1ks0qeq9vyt9l7vgasaajd49ff0k8klurj7fsvp` | 0.0 | 0.0 |
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `quick1l267dmlmprhu4p5aqslf50f495vjqlg3ks6kte` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `quick1cx82d7pm4dgffy7a93rl6ul5g84vjgxkvzk327` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos14uyfxlv00lj0qhcwt7vms2rsf7kxuld75qcj6u` | `quick14uyfxlv00lj0qhcwt7vms2rsf7kxuld7lygqrw` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-secretnetwork</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `secret1czy3ak7s26sajcr99cyzfd2l75rprjxlkw4n6t` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `secret1u4rm5gqswjyqhtyatu56q42avnzlg0gxklj3v9` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `secret1xpgjd2akpc8gmwez25keftpmlgs4aa3un463s7` | 0.0 | 0.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | `secret1q5uvvkg0wp94hpnc8argyjr9ldgqyuty86r68v` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-sei</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `sei18xrruhq5r246mwk0yj9elnn3mte8xa9ude2m2a` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-sentinel</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `sent1ryq6zncdxpdnnwhn9h24ar48ap9zkqglzx6nwr` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-stargaze</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `stars1x8xujz36hgmg27c6x87vxy4pzs5s45ecxrakvt` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-stride</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `stride1ks0qeq9vyt9l7vgasaajd49ff0k8klur63e7pl` | 0.0 | 0.0 |
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `stride1l267dmlmprhu4p5aqslf50f495vjqlg37l2cx8` | 0.0 | 0.0 |
| Cosmos Spaces | `cosmos126pkrcvytfvsvrdm7x4wme5y780amvwwarzezc` | `stride1558hpgzv2jt6rkuccaklxhgtj8mcleq0npzyyn` | 0.0 | 0.0 |
| Architect Nodes | `cosmos1cx82d7pm4dgffy7a93rl6ul5g84vjgxk8xxrnv` | `stride1cx82d7pm4dgffy7a93rl6ul5g84vjgxkydxl8q` | 0.0 | 0.0 |
| IcyCRO | `cosmos1p7d8mnjttcszv34pk2a5yyug3474mhffasa7tg` | `stride1nna7k5lywn99cd63elcfqm6p8c5c4qcut7a9ac` | 0.0 | 0.0 |
| Decentrio | `cosmos1w0f29w3hst8hzhr2cv30cfjvqp70yyp9wgr3pv` | `stride1w0f29w3hst8hzhr2cv30cfjvqp70yyp9drrd4q` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `stride18xrruhq5r246mwk0yj9elnn3mte8xa9ur7m3cs` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `stride1p4557mdpc2qk8vcemeqgrcg55gs2uyzn8ah3nv` | 0.0 | 0.0 |
| WhisperNode | `cosmos1ryq6zncdxpdnnwhn9h24ar48ap9zkqgleav22v` | `stride1ryq6zncdxpdnnwhn9h24ar48ap9zkqgl6kvk7q` | 0.0 | 0.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | `stride1wqp8yslqh2mdvxzgljsde8wu6nyjp4qy4lcy6m` | 0.0 | 0.0 |
| Cypher Core | `cosmos12alkl0egcpjnacj7kcx7svuy4u9nvf0s5sx8nf` | `stride1yv2myphganx8evm3z6s8rstwnd468c8cugeum9` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `stride1texfv73p49gv69rl8wehtn9tnvkt9676564tyh` | 0.0 | 0.0 |
| Golden Ratio Staking | `cosmos1n6j7gnld9yxfyh6tflxhjjmt404zruuaf73t08` | `stride1n6j7gnld9yxfyh6tflxhjjmt404zruua243hmt` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-teritori</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Crosnest | `cosmos1l267dmlmprhu4p5aqslf50f495vjqlg3a52yjt` | `tori1l267dmlmprhu4p5aqslf50f495vjqlg3lqadfm` | 0.0 | 0.0 |
| Inter Blockchain Services | `cosmos16vmp7sz28pnvgz6f3zm6q93y39jsd33a5v9dcq` | `tori14uyfxlv00lj0qhcwt7vms2rsf7kxuld7k50mpv` | 0.0 | 0.0 |
| GATA HUB | `cosmos1zy7xyypdwje7w56rdz67pjxtjyk2t4ms5ak23c` | `tori1hghqe5k6jj5ll0fl3wg3prandw07q2h2r30xnk` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-terra2</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Cosmos Spaces | `cosmos1ks0qeq9vyt9l7vgasaajd49ff0k8klure6ez4n` | `terra1ks0qeq9vyt9l7vgasaajd49ff0k8klurl7rzhn` | 0.0 | 0.0 |
| Crosnest | `cosmos19pjtx7dah2fquf7udyxjv94h0eraha789k37ff` | `terra19pjtx7dah2fquf7udyxjv94h0eraha78rjt7tf` | 0.0 | 0.0 |
| Lavender.Five Nodes | `cosmos18xrruhq5r246mwk0yj9elnn3mte8xa9uq4mdvu` | `terra1pn3t586r4t0w4w4pncmmdnsl3fqmj625xngs80` | 0.0 | 0.0 |
| cosmosrescue | `cosmos13rw0xgyu0fqgdsjsrwlrf49j74us9l5n3erxhz` | `terra1zr5a4asqa7l0994lypjrf8zrzafdxtv6ev9v9l` | 0.0 | 0.0 |
| PFC | `cosmos1wqp8yslqh2mdvxzgljsde8wu6nyjp4qyk5ccwh` | `terra1j32kujppc2xekktlnrgqepnmjhpg44jwf5045t` | 0.0 | 0.0 |
</details>

<details><summary>cosmoshub-umee</summary>

| Name | Chain 1 Address | Chain 2 Address | Period Spend Limit | Active Period Spend Limit |
|------|-----------------|-----------------|--------------------|---------------------------|
| Architect Nodes | `cosmos1ln3l6waaqdjcskt3ztzqlzkpvmzp7zw4ky2xgp` | `umee1cx82d7pm4dgffy7a93rl6ul5g84vjgxk4smuh7` | 0.0 | 0.0 |
| BlueStake | `cosmos1x8xujz36hgmg27c6x87vxy4pzs5s45ecjl2t86` | `umee1x8xujz36hgmg27c6x87vxy4pzs5s45ecqfh5rg` | 0.0 | 0.0 |
</details>
