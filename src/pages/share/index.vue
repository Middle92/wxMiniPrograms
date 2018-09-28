<template>
    <div class="container">
        <canvas canvas-id="shareCanvas" :style="{width:canvasWidth + 'px', height: canvasHeight + 'px'}"></canvas>
        <button class="primary" @click="exportImage">导出图片</button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            canvasWidth: null,
            canvasHeight: null
        }
    },
    methods: {
        exportImage() {
            wx.canvasToTempFilePath({
                canvasId: "shareCanvas",
                success: function(res) {
                    console.log(res.tempFilePath);
                    wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success(res) {
                        console.log("success");
                    }
                    });
                }
            })
        }
    },
    mounted() {
        let self = this;
        
        function circleImg(ctx, img, x, y, r) {
            ctx.save();
            var d = 2 * r;
            var cx = x + r;
            var cy = y + r;
            ctx.arc(cx, cy, r, 0, 2 * Math.PI);
            ctx.clip();
            ctx.drawImage(img, x, y, d, d);
            ctx.restore();
        }

        wx.getSystemInfo({
            success(res) {
                self.canvasWidth = res.windowWidth;
                self.canvasHeight = res.windowHeight;

                const ctx = wx.createCanvasContext("shareCanvas");
                // 背景颜色
                ctx.fillStyle = "#f7f7f7";
                ctx.fillRect(0, 0, self.canvasWidth, self.canvasHeight);

                // 标题文字
                ctx.font = "normal normal bold 18px arial";
                ctx.setFillStyle("#333");
                ctx.fillText("采购用于回收液晶广告", 12, 33); 

                // 时间文字
                ctx.font = "normal normal normal 14px arial";
                ctx.setFillStyle("#888");
                ctx.fillText("2018-06-05 11:05丨 商机总收益80.00元", 12, 62); 

                // 头像圆形
                circleImg(
                    ctx,
                    "/static/test_header.jpg",
                    // "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHkAeQMBEQACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABgcBBAMFCAL/xABCEAABAwMBBAYHAgwHAQAAAAABAAIDBAURBgcSITETQVFhcYEUIjJCkaHBUpQVFhdXcoKSsbLR0+IjJERUYqLCCP/EABsBAQACAwEBAAAAAAAAAAAAAAAEBQECBgMH/8QANhEAAgIBAQQGBwcFAAAAAAAAAAECAwQRBRIhMRNBUWHB0QYUFVJTkbEyMzRDcYHhIiNyofD/2gAMAwEAAhEDEQA/AJwvlJ0YQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEB8yyMhifLM9rI2Dec9xwGjtK2jGU3pHmYbSWrItbdb0l6vYtlkpZqkD1pKl53I2sHNw6z3DAyri3Y88bH6a+WnYub8iLHKVk92CJYR4/BUxK1MLBkIAgCAIAgCAIAgCAIAgPmWSOGMyTPZHG3iXPcAB5raMJSekVqzDaXMrjanqignsH4PtdxgnlmmAmEL97DBk8xw5gLpthbPthf0tsGklw17SvzL4yhuxZWVmv1wssdU23TmB1S0NfI0euADngepdPfi05Di7Vrp8iBCyUNd077RDqapunpV51NNb+jcC0CZwfKf0jwA8VC2lvwq3KKVLXuWi/bmetOjlrKWheNHV0tZCJKOqiqGY9uOQOB8wuDuqsrlpOOjLmEoyXB6nOvI2CwAgCAIAgCAIAgPmSRkUbpJXtYxoy5zjgAd5W0YuTSS4mG0lxK01VtTihe+l07G2Vw4GrlHq/qt6/E/ArqcH0e1SnkvTuXi/Arrs3qgVldb1crvL0lyrZql3/N3AeA5BdNRj0460qikQZTlP7TNDK9TQwgM5KA56SsqaKYTUk8sEo5PjeWn5LWcIWLdmtV3mU3F6on2mdqVfSOZDfGemwZ4zMAbK36O+XiqHM9H6bFvUPdfZ1fx/wBwJlWbOPCfEtm13Oiu9Eyst1Q2eB/Jzeo9hHMHxXI5GNZj2OuxaNFnXZGa1izbUc3CAIAgCAID5kkZFG6SVwZGwFznOOAAOZK2jFyeiRhtJaso3aBrafUFS6ioXujtcZ4AcDOftO7uwefh3my9lQxIKc+M3/ruXmU+TkOx6LkfOlNm191LRmvYIKG3AZ9LrH7jXDtAxkjv5d6uCKbM+zKol322G/2W8zxgl1NSVQ6U/og8/igIPPDJTzPhmjdHKxxa9jxhzSOYI6igOJAZAJPAICa0Ozit9HhqL/dbXYWTN3o47jPuSuHbucx54QHNf9ld9tVtN0oZaW70AG8ZqB++Q3rO71jwygI/pbUldpu4tqaN29G7hNAT6srew9/Yer4qJm4VWZXuWfs+w9arZVS1R6Bs10pbzbYa+hfvQyjzaetp7wvnuVjWY1rrmuKLuuyNkd5G6oxuEAQBAEBWm2HUbqenjsVI8h8zRJUkHGGe63zIyfAdq6r0ewVJvJmuXL9etldm3flogez6yRai1ja7ZUA9BNLvSgdbGtLiPMDHmusK0nm37UFQLrT6ZpHdDbqWBkj4Y+Ae8+yD3NAGB2nwQER2U2+z3TV9PBf6o00DWOkiLZui35RjdbvjBHWeBHEBAS3bxarbIaLUNoljl6SV1FVyRu3g+RgyCT1uwCCe4ICosHsQFjbE7Rb6rUNRd7w6NtFaY2y5l9kSudusJ7hxPiAgM7brdZKLUcU9nrTU1FXGZKxrp+m3XZGDvZOMjPDPDA5IDOw7UdXa9X01r6RzqC4kxyQ54B+6S14Hbwwe49wQGlto0/T6f1vM2iYI6esibVMYBwaXEhwHdlpPmgPrZLqJ1tvP4MnkxSVxw0H3ZfdPny+Co9u4Svx+miv6o/Tr+XMl4du5PdfJl2Lhi4CwAgCAw5zWNLnnDWjJJ6gtopt6Iw3otTzRqK5vvF7ra95z08pc3ubyaPhhfTcWiNFEal1IoLJuc3JnZ7Ob3Fp7WlruVScU8cpZKexj2lpPlvZ8l7mhZm3bRtbcauDU1nidVwOgbHUNhG8W49l4A5gg44csd6Apy1Wutu9YyjttLNU1Lzhscbcnz7B3lATzaSyHTumbBopkrJayk3quvLDkNlfnDfgT5YQGpRbOKyfTj6x73MuLxvw0xwAW/ZPY4/LrVJZtuqGT0a+xyb8V3IsI4E5Vb3X2H1sqnpnXK76Yub/Ro73SOpGveMGOcZ3AfMnh24Cu9deKIDWhFNRafuenLhJQ3elfBK0kAkepIO1p6whgsTYdoqvqtQU+oa2nkgt9GC+B0g3enkIIG72gZzntwO1AdJtsv1PfdbzehvEkFFE2lDxycQSXEebiPJAQOGR8MrJI3Fr2ODmuHURyWGk1o+Q10PTVkrxdbPR17f8AUQtee4kcR8cr5nl0ui+dXY9C/qlvwUjdUY9AgCA6bWdS6k0ndpmHDhSvaD3uG79VO2bWrMuuL7fpxPHIlu1Nnm5fSCiMjmgJzo7alqDS0DaOJ0dZQN4Mp6nJ6MdjXDiB3cQgO7vG3G+VVM+K1UFHbXvGHTNzI/yzw+IKAh2krnSM1Kyuv29Uue4u6WZ5diUng9+ef8+KhbQrusx3Gp6P6rsJWG6lcul5FzfhF5xiNpz3riHQjqlSmuZUm0avt1XfOkoIw2pZwqJY3eq5w5eY6z/Jdhsmq6ujSx8Or9DmtourptK+fWd5p7bPf7ZSR0lygp7tFEAGPqciXhyy7r8SM96tCAceqtsWor9Svo6YRWymeMPFMSZHjs3zyHhhAVy45PJAAgL52T1Bn0XStccmGWSP/tn/ANLg9vw3c6T7Un4eBc4T1qRMFSkoIAgIztJz+JF0x9hn8bVabF/HV/v9GR8v7lnnw819CKQwgCAIDIQEjpNX19NYnW1hOcbsc+fWjZ2D6HqUCezqZ39K/l3k+O0LY0dEvn3EcOSp5AMIAgCAIC79jefxTlz/ALx/8LVxHpH+MX+K8S2wfuydqgJoQBAdDryHp9HXdg6qZz/2fW+isdky3c2t9/14HhkrWqR50PNfRSjMIDkgglqJWRQRPlke7daxjd5zj2ADmgLU0psQvNzYyovs7bXC7iIQN+YjvHJvmc9yAsa2bGNH0TW9PS1FbIPeqJyM+TcBAdwNmmjAMfi/SY/W/mgOtuOx7RlaHGO3y0rz71PO4Y8iSPkgK+1PsJr6SN8+nK5ta1oyKaoAjkPg72T54QFS3CgqrbWS0ldTy09REcPilbuuagNZAZHNAXrsji6PRkTiMdLPI/54+i4X0glrmtdiRcYS/tE0VGSwgCA4quBlVST08nsSxujd4EY+q9KpuuamuriazW9Fo8xV1JJQ1k9LO3dlhkdG8d4OF9QhNWQU48nxOfa0ejOOGJ80rIomOe97g1rWjJcTyAWxg9O7K9nVNpOgZW18TJb1M3MjyM9AD7jPqevwQFggYQGUAQBAOaAiW0LQtv1la3RStbDXxj/LVQbxYfsu7WnsQHlW7W6qtVyqKCuiMVTTvLJGHqI+iA1AgPSWkLebXpi20bm7r2QAvHY53rH5kr5vtK7psuc12/TgXuPHdrSO3UE9ggCAICpdrelZGVLr/RRF0UgAqmt9x3IP8D19/iux2BtGMoerWPiuXl5FXmUNPpFyODYPY23XWzaqoj3obdCZ+PLpCQ1g+ZP6q6UgHpkYCAygCAIAgCAFAUD/APRljbBdLdeoI8elMdBOR9tmC0nvIJ/ZQEJ2b6Zffr3HNNGfQaRwkmeRwcebWef7lVbXzli0NL7UuXmScarpJ9yL7Xz8ugsAIAgCAw5rXtLXtDmuGCCMghbRk4vVGGk+DIdUaIkt9wdctH3aezVTvajZ60Tu7HUO45HcujxPSK2tbt63u/k/5INmDFvWHA3YdS7TrYAyooLTd2N99juje75tHyVzXt3Bnzk1+q8iK8O1dRsDaRrKMYm0I556zHV/2lSFtXCf5iPP1e33R+U/VP5v6n73/Ys+1ML4iHq9vuj8p+qvzf1H3v8AsT2phfEQ9Xt90flR1QOez+q+9n+mntPD+Ih6vb7o/Kjqc8tn1V97P9NPaeH8RfMer2+6zrL9tU1nQULqk6Rho4uRlne6UN8Q3GPNelOfjXS3K5ps1lVZFatFZ3bV171td7fTX6r36V1UwNgiYGMZvEAkY45wTxOV7XzddUprmk2axWskmXlbbfSWujjo7fA2CnjGGsb+89p7181vyLL5uyx6tl9CEYLSJtLwNwgCAIAgCAIAgCyAgCwAsgIDDmhwIcAWkYIIyCsqTXFGGtSHXXZ5a6i5U9xtuKGoinZK6Ng/w5MOB5e6eHV8Fd4+27o1Oq3+pNNd68yJZiRct6PBkyKo2TEFgBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAEAQBAf/2Q==",
                    12,
                    97,
                    25
                );

                // 用户名
                ctx.font = "normal normal normal 15px arial";
                ctx.setFillStyle("#333");
                ctx.fillText("何强", 72, 117);

                // 公司名称
                ctx.font = "normal normal normal 11px arial";
                ctx.setFillStyle("#888");
                ctx.fillText("广州一呼百应网络技术股份有限公司", 72, 138);

                // 二维码
                ctx.drawImage('/static/code.jpg', (self.canvasWidth-200)/2, (self.canvasHeight-200)/2, 200, 200);
                ctx.restore();

                // 渲染图片
                ctx.draw();
            }
        })
    }
}
</script>

<style scoped>
/* canvas {
    z-index:-1;
} */
.container {
    background: #f7f7f7;
}
.primary {
    /* position: absolute; */
    /* bottom: 50px; */
    width: 80%;
    margin-bottom: 20px;
    /* z-index:10; */
}
</style>

